#!/usr/bin/env python3
"""Slice transparent character atlases into deterministic web sprites."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ATLAS_ROOT = ROOT / "assets" / "characters" / "atlases" / "transparent"
OUTPUT_ROOT = ROOT / "assets" / "characters"

ATLASES = {
    "heroes": ("heroes.png", 4, 2),
    "math": ("math.png", 4, 4),
    "shanhai": ("shanhai.png", 4, 4),
    "xiyou": ("xiyou.png", 4, 3),
    "fengshen": ("fengshen.png", 4, 2),
    "liaozhai": ("liaozhai.png", 4, 2),
    "academy": ("academy.png", 4, 2),
}


def trim_and_square(image: Image.Image, canvas_size: int = 512) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        return Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))

    subject = image.crop(bbox)
    padding = 34
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
    for group, (filename, columns, rows) in ATLASES.items():
        atlas = Image.open(ATLAS_ROOT / filename).convert("RGBA")
        destination = OUTPUT_ROOT / group
        destination.mkdir(parents=True, exist_ok=True)

        x_edges = [round(atlas.width * index / columns) for index in range(columns + 1)]
        y_edges = [round(atlas.height * index / rows) for index in range(rows + 1)]

        index = 0
        for row in range(rows):
            for column in range(columns):
                cell = atlas.crop(
                    (
                        x_edges[column],
                        y_edges[row],
                        x_edges[column + 1],
                        y_edges[row + 1],
                    )
                )
                sprite = trim_and_square(cell)
                final_path = destination / f"{group}-{index:02d}.webp"
                temporary_path = destination / f".{group}-{index:02d}.tmp.webp"
                sprite.save(temporary_path, "WEBP", quality=92, method=4)
                with Image.open(temporary_path) as check:
                    check.verify()
                temporary_path.replace(final_path)
                index += 1


if __name__ == "__main__":
    main()
