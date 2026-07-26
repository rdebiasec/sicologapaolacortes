#!/usr/bin/env python3
"""Enhance source photos into web-ready assets.

Reads originals from a source folder, applies adaptive exposure, local contrast
(CLAHE on luminance), saturation and sharpening, then writes JPEG + WebP pairs
into site/public/images.

Usage:
    python3 scripts/enhance_photos.py "/path/to/originals"
"""

from __future__ import annotations

import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

DEST = Path(__file__).resolve().parent.parent / "public" / "images"


@dataclass(frozen=True)
class Recipe:
    source: str
    output: str
    max_width: int
    target_luma: float
    saturation: float
    clahe_clip: float


# Portraits get a brighter, softer treatment; event photos get more punch so the
# rooms, banners and audiences read clearly at gallery size.
RECIPES: tuple[Recipe, ...] = (
    Recipe("foto1", "portrait-hero", 1400, 0.60, 1.06, 2.0),
    Recipe("foto2", "portrait-about", 1400, 0.60, 1.06, 2.0),
    Recipe("resume profesional", "portrait-og", 1400, 0.60, 1.05, 1.8),
    Recipe("educación emocional universidad del norte", "authority-uninorte", 1200, 0.56, 1.14, 2.6),
    Recipe("Programa del congreso de la republica salud mental", "authority-congreso", 1200, 0.56, 1.14, 2.6),
    Recipe("radio conversando sobre salud mental", "authority-radio", 1200, 0.58, 1.16, 2.8),
    Recipe("foro educación emocional", "authority-foro", 1200, 0.56, 1.14, 2.6),
    Recipe("conferencia día de la mujer", "authority-conferencia", 1200, 0.58, 1.18, 3.0),
    Recipe("atención virtual", "authority-virtual", 1200, 0.58, 1.16, 2.8),
    Recipe("talleres educación emocional", "authority-talleres", 1200, 0.56, 1.14, 2.6),
    Recipe("trabajando con adolescentes", "authority-adolescentes", 1200, 0.56, 1.14, 2.6),
    Recipe("universidad libre herramientas para la vida", "authority-unilibre", 1200, 0.56, 1.14, 2.6),
    Recipe("cafe conversando herramientas de familia universidad autónoma", "authority-cafe", 1200, 0.56, 1.14, 2.6),
    Recipe("Hablando sobre resolución de conflictos", "authority-conflictos", 1200, 0.56, 1.14, 2.6),
    Recipe("prevención del acoso escolar", "authority-acoso", 1200, 0.56, 1.16, 2.8),
)


def adaptive_exposure(img: Image.Image, target_luma: float) -> Image.Image:
    """Gamma-correct the image so mean perceptual luminance approaches target."""
    arr = np.asarray(img, dtype=np.float32) / 255.0
    luma = 0.2126 * arr[..., 0] + 0.7152 * arr[..., 1] + 0.0722 * arr[..., 2]
    mean = float(np.clip(luma.mean(), 0.01, 0.99))
    if abs(mean - target_luma) < 0.02:
        return img
    gamma = np.log(target_luma) / np.log(mean)
    # Clamp so already well-exposed frames are nudged, never blown out.
    gamma = float(np.clip(gamma, 0.55, 1.6))
    corrected = np.power(arr, gamma)
    return Image.fromarray((np.clip(corrected, 0, 1) * 255).astype(np.uint8), "RGB")


def clahe_luminance(img: Image.Image, clip_limit: float, tiles: int = 8) -> Image.Image:
    """Contrast-limited adaptive histogram equalization applied to L only."""
    lab = img.convert("LAB")
    l_channel, a_channel, b_channel = lab.split()
    l_arr = np.asarray(l_channel, dtype=np.uint8)
    height, width = l_arr.shape

    tile_h = max(1, height // tiles)
    tile_w = max(1, width // tiles)
    mappings = np.zeros((tiles, tiles, 256), dtype=np.float32)

    for ty in range(tiles):
        for tx in range(tiles):
            y0, y1 = ty * tile_h, (ty + 1) * tile_h if ty < tiles - 1 else height
            x0, x1 = tx * tile_w, (tx + 1) * tile_w if tx < tiles - 1 else width
            tile = l_arr[y0:y1, x0:x1]
            hist = np.bincount(tile.ravel(), minlength=256).astype(np.float32)
            limit = clip_limit * tile.size / 256.0
            excess = np.maximum(hist - limit, 0).sum()
            hist = np.minimum(hist, limit) + excess / 256.0
            cdf = np.cumsum(hist)
            cdf /= max(cdf[-1], 1e-6)
            mappings[ty, tx] = cdf * 255.0

    # Bilinear interpolation of tile mappings across the image.
    ys = np.arange(height, dtype=np.float32)
    xs = np.arange(width, dtype=np.float32)
    gy = np.clip(ys / tile_h - 0.5, 0, tiles - 1)
    gx = np.clip(xs / tile_w - 0.5, 0, tiles - 1)
    y0i = np.floor(gy).astype(np.int32)
    x0i = np.floor(gx).astype(np.int32)
    y1i = np.minimum(y0i + 1, tiles - 1)
    x1i = np.minimum(x0i + 1, tiles - 1)
    wy = (gy - y0i)[:, None]
    wx = (gx - x0i)[None, :]

    idx = l_arr
    top_left = mappings[y0i[:, None], x0i[None, :], idx]
    top_right = mappings[y0i[:, None], x1i[None, :], idx]
    bottom_left = mappings[y1i[:, None], x0i[None, :], idx]
    bottom_right = mappings[y1i[:, None], x1i[None, :], idx]

    top = top_left * (1 - wx) + top_right * wx
    bottom = bottom_left * (1 - wx) + bottom_right * wx
    equalized = top * (1 - wy) + bottom * wy

    # Blend back so the result stays natural rather than HDR-looking.
    blended = 0.65 * equalized + 0.35 * l_arr.astype(np.float32)
    new_l = Image.fromarray(np.clip(blended, 0, 255).astype(np.uint8), "L")
    return Image.merge("LAB", (new_l, a_channel, b_channel)).convert("RGB")


def process(source_path: Path, recipe: Recipe) -> None:
    with Image.open(source_path) as raw:
        img = ImageOps.exif_transpose(raw).convert("RGB")

    img = adaptive_exposure(img, recipe.target_luma)
    img = clahe_luminance(img, recipe.clahe_clip)
    img = ImageEnhance.Color(img).enhance(recipe.saturation)
    img = ImageEnhance.Contrast(img).enhance(1.04)

    if img.width > recipe.max_width:
        ratio = recipe.max_width / img.width
        img = img.resize((recipe.max_width, round(img.height * ratio)), Image.LANCZOS)

    img = img.filter(ImageFilter.UnsharpMask(radius=1.6, percent=95, threshold=3))

    DEST.mkdir(parents=True, exist_ok=True)
    jpg_path = DEST / f"{recipe.output}.jpg"
    webp_path = DEST / f"{recipe.output}.webp"
    img.save(jpg_path, "JPEG", quality=84, optimize=True, progressive=True)
    img.save(webp_path, "WEBP", quality=82, method=6)

    print(
        f"{recipe.output}: {img.width}x{img.height} "
        f"jpg={jpg_path.stat().st_size // 1024}KB webp={webp_path.stat().st_size // 1024}KB"
    )


def normalize(name: str) -> str:
    """macOS stores accents decomposed (NFD); compare on a common form."""
    return unicodedata.normalize("NFC", name).strip().casefold()


def find_source(folder: Path, stem: str) -> Path | None:
    wanted = normalize(stem)
    for candidate in folder.iterdir():
        if candidate.is_file() and normalize(candidate.stem) == wanted:
            return candidate
    return None


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: enhance_photos.py <source-folder>", file=sys.stderr)
        return 2

    folder = Path(sys.argv[1]).expanduser()
    if not folder.is_dir():
        print(f"source folder not found: {folder}", file=sys.stderr)
        return 1

    missing = []
    for recipe in RECIPES:
        source = find_source(folder, recipe.source)
        if source is None:
            missing.append(recipe.source)
            continue
        process(source, recipe)

    if missing:
        print("missing sources: " + ", ".join(missing), file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
