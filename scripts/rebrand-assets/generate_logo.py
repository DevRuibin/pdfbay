#!/usr/bin/env python3
"""Generate the PDFBay brand assets: SVG marks + rasterized favicons + OG banner."""
import math
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
IMAGES = os.path.join(ROOT, "public", "images")

GRAD_STOPS = [(0x63, 0x66, 0xF1), (0x8B, 0x5C, 0xF6), (0xD9, 0x46, 0xEF)]


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient_color(t):
    if t <= 0.5:
        return lerp(GRAD_STOPS[0], GRAD_STOPS[1], t / 0.5)
    return lerp(GRAD_STOPS[1], GRAD_STOPS[2], (t - 0.5) / 0.5)


def render_tile(size, supersample=4):
    """Gradient rounded square + white page glyph. Returns RGBA image."""
    s = size * supersample
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # gradient fill
    for y in range(s):
        t = y / (s - 1)
        c = gradient_color(t)
        draw.line([(0, y), (s, y)], fill=c + (255,))

    # rounded mask
    mask = Image.new("L", (s, s), 0)
    mdraw = ImageDraw.Draw(mask)
    radius = int(s * 0.3)
    mdraw.rounded_rectangle([0, 0, s - 1, s - 1], radius=radius, fill=255)
    tile = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    tile.paste(img, (0, 0), mask)

    # inner page (white)
    u = s / 64.0  # unit = 1/64 of tile
    page = [
        int(20 * u), int(14 * u), int(44 * u), int(50 * u)
    ]
    pdraw = ImageDraw.Draw(tile)
    pdraw.rounded_rectangle(page, radius=int(5 * u), fill=(255, 255, 255, 255))
    # fold
    fold = [
        (int(35.5 * u), int(14 * u)),
        (int(44 * u), int(22.5 * u)),
        (int(44 * u), int(14 * u)),
    ]
    pdraw.polygon(fold, fill=(226, 232, 240, 255))
    # content lines
    line_color = (199, 210, 254, 255)
    for ly in (25, 32):
        pdraw.rounded_rectangle(
            [int(23 * u), int(ly * u), int(41 * u), int((ly + 3.4) * u)],
            radius=int(1.7 * u), fill=line_color,
        )
    pdraw.rounded_rectangle(
        [int(23 * u), int(39 * u), int(34 * u), int((39 + 3.4) * u)],
        radius=int(1.7 * u), fill=line_color,
    )

    return tile.resize((size, size), Image.LANCZOS)


def font(bold=True, px=48):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFNS.ttf",
    ]
    for c in candidates:
        try:
            return ImageFont.truetype(c, px)
        except Exception:
            continue
    return ImageFont.load_default()


def make_og_banner():
    W, H = 1200, 630
    img = Image.new("RGBA", (W, H), (11, 13, 23, 255))

    def blob(cx, cy, radius, color, alpha):
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        d.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=color + (alpha,))
        layer = layer.filter(ImageFilter.GaussianBlur(radius * 0.45))
        img.alpha_composite(layer)

    blob(950, 120, 420, (99, 102, 241), 110)
    blob(200, 560, 460, (217, 70, 239), 90)
    blob(640, 320, 300, (139, 92, 246), 60)

    # subtle grid
    d = ImageDraw.Draw(img)
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 8))
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 8))

    # logo tile
    tile = render_tile(220, supersample=4)
    img.alpha_composite(tile, (90, 205))

    d = ImageDraw.Draw(img)
    f_big = font(px=92)
    d.text((380, 220), "PDFBay", font=f_big, fill=(255, 255, 255, 255))
    f_sub = font(px=34)
    d.text((384, 340), "Free, private PDF tools — 100% in your browser", font=f_sub, fill=(203, 213, 225, 255))

    out = img.convert("RGB")
    out.save(os.path.join(IMAGES, "og-home.png"))
    print("og-home.png written")


def main():
    os.makedirs(IMAGES, exist_ok=True)

    # --- SVG marks ---
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="pdfbay-g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6366f1"/>
      <stop offset="0.55" stop-color="#8b5cf6"/>
      <stop offset="1" stop-color="#d946ef"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="60" height="60" rx="18" fill="url(#pdfbay-g)"/>
  <path d="M20 15a5 5 0 0 1 5-5h10.5L43 17.5V46a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5z" fill="#ffffff"/>
  <path d="M35.5 10 43 17.5h-5.5a2 2 0 0 1-2-2z" fill="#e2e8f0"/>
  <rect x="23" y="25" width="18" height="3.4" rx="1.7" fill="#c7d2fe"/>
  <rect x="23" y="32" width="18" height="3.4" rx="1.7" fill="#c7d2fe"/>
  <rect x="23" y="39" width="11" height="3.4" rx="1.7" fill="#c7d2fe"/>
</svg>
'''
    for name in ("favicon.svg", "favicon-no-bg.svg"):
        with open(os.path.join(IMAGES, name), "w") as f:
            f.write(svg)
        print(f"{name} written")

    # --- raster favicons ---
    render_tile(512).save(os.path.join(IMAGES, "favicon-512x512.png"))
    render_tile(192).save(os.path.join(IMAGES, "favicon-192x192.png"))
    render_tile(180).save(os.path.join(IMAGES, "apple-touch-icon.png"))
    render_tile(32).save(os.path.join(IMAGES, "favicon.png"))

    ico = Image.new("RGBA", (48, 48), (0, 0, 0, 0))
    ico.paste(render_tile(48), (0, 0))
    ico.save(os.path.join(ROOT, "public", "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])

    print("favicon PNGs + ICO written")

    make_og_banner()


if __name__ == "__main__":
    main()
