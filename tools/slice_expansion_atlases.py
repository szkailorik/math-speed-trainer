#!/usr/bin/env python3
"""Remove green screen and slice six 5x5 expansion atlases into 300 sprites."""

from pathlib import Path
import subprocess

from PIL import Image, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "characters" / "expansion" / "atlases" / "source"
TRANSPARENT = ROOT / "assets" / "characters" / "expansion" / "atlases" / "transparent"
OUTPUT = ROOT / "assets" / "characters" / "expansion"
CHROMA_TOOL = Path("/Users/superbianbian/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py")
GROUPS = ("math", "shanhai", "xiyou", "fengshen", "liaozhai", "academy")


def trim_and_square(image: Image.Image, canvas_size: int = 512) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        return Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    subject = image.crop(bbox)
    padding = 30
    max_subject = canvas_size - padding * 2
    scale = min(max_subject / subject.width, max_subject / subject.height)
    subject = subject.resize(
        (max(1, round(subject.width * scale)), max(1, round(subject.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    canvas.alpha_composite(subject, ((canvas_size - subject.width) // 2, (canvas_size - subject.height) // 2))
    return canvas


def make_elite_variant(sprite: Image.Image, index: int) -> Image.Image:
    """Create a collectible advanced form while preserving the base silhouette."""
    rgba = ImageOps.mirror(sprite)
    alpha = rgba.getchannel("A")
    rgb = rgba.convert("RGB").convert("HSV")
    hue, saturation, value = rgb.split()
    shift = 22 + (index % 5) * 11
    hue = hue.point(lambda pixel: (pixel + shift) % 256)
    saturation = ImageEnhance.Contrast(saturation).enhance(1.1)
    recolored = Image.merge("HSV", (hue, saturation, value)).convert("RGBA")
    recolored.putalpha(alpha)

    glow_alpha = alpha.filter(ImageFilter.GaussianBlur(9)).point(lambda pixel: min(150, pixel))
    glow_color = ((244, 188, 72, 0), (104, 196, 255, 0), (214, 125, 255, 0))[index % 3]
    glow = Image.new("RGBA", rgba.size, glow_color)
    glow.putalpha(glow_alpha)
    return Image.alpha_composite(glow, recolored)


def make_family_variant(sprite: Image.Image, index: int) -> Image.Image:
    """Theme-preserving local variant used when a remote atlas is unavailable."""
    rgba = sprite.convert("RGBA")
    if index % 2:
        rgba = ImageOps.mirror(rgba)
    alpha = rgba.getchannel("A")
    hsv = rgba.convert("RGB").convert("HSV")
    hue, saturation, value = hsv.split()
    hue = hue.point(lambda pixel: (pixel + (index * 17) % 96) % 256)
    saturation = ImageEnhance.Contrast(saturation).enhance(1.0 + (index % 4) * 0.08)
    value = ImageEnhance.Brightness(value).enhance(0.9 + (index % 5) * 0.045)
    recolored = Image.merge("HSV", (hue, saturation, value)).convert("RGBA")
    recolored.putalpha(alpha)
    glow_alpha = alpha.filter(ImageFilter.GaussianBlur(7)).point(lambda pixel: min(105, pixel))
    glow = Image.new("RGBA", rgba.size, ((92, 196, 255), (255, 183, 77), (200, 126, 255))[index % 3] + (0,))
    glow.putalpha(glow_alpha)
    return Image.alpha_composite(glow, recolored)


def main() -> None:
    TRANSPARENT.mkdir(parents=True, exist_ok=True)
    for group in GROUPS:
        destination = OUTPUT / group
        destination.mkdir(parents=True, exist_ok=True)
        source = SOURCE / f"{group}.png"
        transparent = TRANSPARENT / source.name
        if source.exists():
            subprocess.run(
                ["python3", str(CHROMA_TOOL), "--input", str(source), "--out", str(transparent),
                 "--auto-key", "corners", "--soft-matte", "--spill-cleanup", "--force"],
                check=True,
            )
            atlas = Image.open(transparent).convert("RGBA")
            x_edges = [round(atlas.width * index / 5) for index in range(6)]
            y_edges = [round(atlas.height * index / 5) for index in range(6)]
            local_index = 0
            for row in range(5):
                for column in range(5):
                    cell = atlas.crop((x_edges[column], y_edges[row], x_edges[column + 1], y_edges[row + 1]))
                    sprite = trim_and_square(cell)
                    sprite.save(destination / f"{group}-{local_index:02d}.webp", "WEBP", quality=91, method=4)
                    elite = make_elite_variant(sprite, local_index)
                    elite.save(destination / f"{group}-{local_index + 25:02d}.webp", "WEBP", quality=91, method=4)
                    local_index += 1
        else:
            base_files = sorted((ROOT / "assets" / "characters" / group).glob(f"{group}-*.webp"))
            if not base_files:
                raise FileNotFoundError(f"No source atlas or base sprites for {group}")
            for index in range(50):
                base = Image.open(base_files[index % len(base_files)]).convert("RGBA")
                variant = make_family_variant(base, index)
                variant.save(destination / f"{group}-{index:02d}.webp", "WEBP", quality=91, method=4)


if __name__ == "__main__":
    main()
