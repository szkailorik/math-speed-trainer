#!/usr/bin/env python3
"""Slice the transparent 4x4 weapon atlas into deterministic WebP sprites."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ATLAS = ROOT / "assets" / "weapons" / "atlases" / "transparent" / "weapons-v1.png"
OUTPUT = ROOT / "assets" / "weapons" / "sprites"
NAMES = [
    "knight-sword",
    "star-staff",
    "precision-crossbow",
    "guardian-hammer",
    "math-talisman-blade",
    "xiyou-golden-cudgel",
    "fengshen-thunder-whip",
    "liaozhai-talisman-sword",
    "academy-crescent-wand",
    "fire-orb",
    "ice-arrow",
    "lightning-spear",
    "meteor-star",
    "rainbow-prism",
    "arcane-bomb",
    "holy-wind-disc",
]


def trim_and_square(image: Image.Image, canvas_size: int = 512) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        return Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))

    subject = image.crop(bbox)
    padding = 38
    max_subject = canvas_size - padding * 2
    scale = min(max_subject / subject.width, max_subject / subject.height)
    resized = subject.resize(
        (max(1, round(subject.width * scale)), max(1, round(subject.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    canvas.alpha_composite(
        resized,
        ((canvas_size - resized.width) // 2, (canvas_size - resized.height) // 2),
    )
    return canvas


def main() -> None:
    atlas = Image.open(ATLAS).convert("RGBA")
    OUTPUT.mkdir(parents=True, exist_ok=True)

    x_edges = [round(atlas.width * index / 4) for index in range(5)]
    y_edges = [round(atlas.height * index / 4) for index in range(5)]

    for index, name in enumerate(NAMES):
        row, column = divmod(index, 4)
        cell = atlas.crop(
            (
                x_edges[column],
                y_edges[row],
                x_edges[column + 1],
                y_edges[row + 1],
            )
        )
        sprite = trim_and_square(cell)
        final_path = OUTPUT / f"{name}.webp"
        temporary_path = OUTPUT / f".{name}.tmp.webp"
        sprite.save(temporary_path, "WEBP", quality=92, method=4)
        with Image.open(temporary_path) as check:
            check.verify()
        temporary_path.replace(final_path)


if __name__ == "__main__":
    main()
