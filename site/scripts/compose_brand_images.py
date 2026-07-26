#!/usr/bin/env python3
"""Compose brand-styled images from the enhanced portrait assets.

Produces:
  - portrait-hero.jpg/.webp  cut-out portrait over a soft brand gradient
  - og-cover.jpg             1200x630 social share card

Run after enhance_photos.py:
    python3 scripts/compose_brand_images.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

IMAGES = Path(__file__).resolve().parent.parent / "public" / "images"

BG_CREAM = (247, 247, 244)
BRAND_TEAL = (30, 78, 85)
BRAND_SUPPORT = (220, 231, 225)
BRAND_ACCENT = (217, 164, 65)
TEXT_LIGHT = (241, 245, 243)

SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
SERIF_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"


def vertical_gradient(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    width, height = size
    base = Image.new("RGB", (1, height))
    draw = ImageDraw.Draw(base)
    for y in range(height):
        t = y / max(height - 1, 1)
        draw.point(
            (0, y),
            fill=(
                round(top[0] + (bottom[0] - top[0]) * t),
                round(top[1] + (bottom[1] - top[1]) * t),
                round(top[2] + (bottom[2] - top[2]) * t),
            ),
        )
    return base.resize((width, height), Image.BILINEAR)


def background_mask(img: Image.Image, tolerance: int = 34) -> Image.Image:
    """Flood-fill the near-white studio background from the top corners.

    Returns an L mask where 255 = subject, 0 = background.
    """
    width, height = img.size
    # Work on a whiteness map so flood fill tolerates JPEG noise.
    grey = img.convert("L").point(lambda v: 255 if v >= 255 - tolerance else 0)
    marker = grey.copy()
    for seed in ((0, 0), (width - 1, 0), (width // 2, 0)):
        if marker.getpixel(seed) == 255:
            ImageDraw.floodfill(marker, seed, 128, thresh=0)

    # Only the flood-filled (128) pixels are true background.
    mask = marker.point(lambda v: 0 if v == 128 else 255)
    # Pull the edge in slightly to drop the JPEG halo, then feather.
    mask = mask.filter(ImageFilter.MinFilter(5))
    mask = mask.filter(ImageFilter.GaussianBlur(1.4))
    return mask


def compose_hero() -> None:
    # Clinic full-body hero is authored separately (AI + enhance). Do not
    # re-cutout or flatten it when regenerating OG assets.
    source = IMAGES / "portrait-hero.jpg"
    if not source.exists():
        print("portrait-hero: missing, skip")
        return
    print(f"portrait-hero: kept as authored clinic portrait ({source.stat().st_size // 1024}KB)")


def fit_cover(img: Image.Image, size: tuple[int, int], focus_y: float = 0.38) -> Image.Image:
    target_w, target_h = size
    scale = max(target_w / img.width, target_h / img.height)
    resized = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    left = (resized.width - target_w) // 2
    top = int((resized.height - target_h) * focus_y)
    top = max(0, min(top, resized.height - target_h))
    return resized.crop((left, top, left + target_w, top + target_h))


def compose_og() -> None:
    width, height = 1200, 630
    card = vertical_gradient((width, height), BRAND_TEAL, (18, 52, 58))

    with Image.open(IMAGES / "portrait-about.jpg") as raw:
        photo = fit_cover(raw.convert("RGB"), (470, height), focus_y=0.18)

    card.paste(photo, (width - 470, 0))

    # Feather the photo edge into the teal panel.
    fade = Image.new("L", (140, height), 0)
    fade_draw = ImageDraw.Draw(fade)
    for x in range(140):
        fade_draw.line((x, 0, x, height), fill=int(255 * (1 - x / 139)))
    card.paste(Image.new("RGB", (140, height), BRAND_TEAL), (width - 470, 0), fade)

    draw = ImageDraw.Draw(card)
    name_font = ImageFont.truetype(SERIF_BOLD, 62)
    role_font = ImageFont.truetype(SERIF, 34)
    detail_font = ImageFont.truetype(SERIF, 27)

    draw.text((72, 150), "Psicóloga", font=role_font, fill=BRAND_ACCENT)
    draw.text((72, 200), "Paola Cortés", font=name_font, fill=TEXT_LIGHT)
    draw.line((74, 296, 214, 296), fill=BRAND_ACCENT, width=3)
    draw.text(
        (72, 330),
        "Terapia individual, de pareja\ny de familia",
        font=role_font,
        fill=TEXT_LIGHT,
        spacing=12,
    )
    draw.text(
        (72, 452),
        "Virtual preferida · Barranquilla\nBogotá con anticipación",
        font=detail_font,
        fill=BRAND_SUPPORT,
        spacing=10,
    )

    card.save(IMAGES / "og-cover.jpg", "JPEG", quality=88, optimize=True, progressive=True)
    print(f"og-cover: {width}x{height}")


def main() -> int:
    compose_hero()
    compose_og()
    # The scanned flyer is a contact sheet, not a usable web asset.
    for stale in ("portrait-og.jpg", "portrait-og.webp"):
        path = IMAGES / stale
        if path.exists():
            path.unlink()
            print(f"removed {stale}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
