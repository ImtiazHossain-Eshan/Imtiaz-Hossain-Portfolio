"""Extract embedded figures from the project report PDFs.

Uses poppler's pdfimages to pull raster figures (matplotlib exports etc.)
out of each report, filters out tiny artifacts, and writes WebP files to
public/assets/figures/<slug>/ for curation.

Run:  python scripts/extract-figures.py
"""

import subprocess
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAPERS = ROOT / "public" / "assets" / "papers"
OUT = ROOT / "public" / "assets" / "figures"

REPORTS = {
    "brain-tumor": PAPERS / "brain-tumor-segmentation-report.pdf",
    "news-classification": PAPERS / "news-topic-classification-report.pdf",
    "text-detection": PAPERS / "ai-text-detection-report.pdf",
    "software-quality": PAPERS / "software-quality-prediction-report.pdf",
}

MIN_WIDTH = 320   # skip logos, icons, equation fragments
MIN_HEIGHT = 200
MAX_WIDTH = 2000  # downscale anything wider


def extract(slug: str, pdf: Path) -> None:
    out_dir = OUT / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    kept = 0
    with tempfile.TemporaryDirectory() as tmp:
        prefix = str(Path(tmp) / "img")
        subprocess.run(
            ["pdfimages", "-png", "-p", str(pdf), prefix],
            check=True,
            capture_output=True,
        )
        candidates = sorted(Path(tmp).glob("img-*.png"))
        for i, path in enumerate(candidates):
            with Image.open(path) as im:
                w, h = im.size
                if w < MIN_WIDTH or h < MIN_HEIGHT:
                    continue
                if im.mode not in ("RGB", "L"):
                    im = im.convert("RGB")
                if w > MAX_WIDTH:
                    im = im.resize((MAX_WIDTH, int(h * MAX_WIDTH / w)), Image.LANCZOS)
                # keep the source page number from pdfimages naming: img-PPP-NNN.png
                parts = path.stem.split("-")
                page = parts[1] if len(parts) == 3 else "000"
                dest = out_dir / f"p{page}-{i:02d}.webp"
                im.save(dest, "WEBP", quality=85)
                kept += 1
                print(f"  {slug}/{dest.name}  ({w}x{h})")
    print(f"[{slug}] kept {kept} of {len(candidates)} embedded images")


def main() -> None:
    for slug, pdf in REPORTS.items():
        if not pdf.exists():
            raise SystemExit(f"missing report: {pdf}")
        extract(slug, pdf)


if __name__ == "__main__":
    main()
