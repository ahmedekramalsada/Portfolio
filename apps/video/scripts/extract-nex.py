"""Extract the approved NEX artwork without repainting or resampling it.

Requires Pillow. Run with the path to 'NEX AI Robot Character Sheet.png'.
The original backgrounds are intentionally retained; these are not 3D rigs.
"""

import json
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageChops

output = Path(__file__).resolve().parents[1] / "public" / "nex"
source = Path(sys.argv[1]) if len(sys.argv) > 1 else output / "reference.png"
sheet = Image.open(source).convert("RGB")
if sheet.size != (1448, 1086):
    raise ValueError(f"Expected approved 1448×1086 sheet; received {sheet.size}")

# Pixel bounds of artwork panels, excluding the sheet's caption rows.
crops = {
    "hero": (21, 41, 430, 1023),
    "portrait": (975, 24, 1435, 561),
    "neutral": (450, 605, 594, 749),
    "serious": (605, 605, 754, 749),
    "happy": (766, 605, 914, 749),
    "thinking": (927, 605, 1085, 749),
    "surprised": (1099, 605, 1256, 749),
    "speaking": (1269, 605, 1424, 749),
    "explain": (447, 817, 708, 1015),
    "point": (722, 817, 956, 1015),
    "think": (973, 817, 1186, 1015),
    "approve": (1200, 817, 1424, 1015),
}

output.mkdir(parents=True, exist_ok=True)
if source.resolve() != (output / "reference.png").resolve():
    shutil.copyfile(source, output / "reference.png")
for name, bounds in crops.items():
    original = sheet.crop(bounds)
    target = output / f"{name}.png"
    original.save(target)
    decoded = Image.open(target).convert("RGB")
    if decoded.size != original.size or ImageChops.difference(original, decoded).getbbox():
        raise AssertionError(f"Artwork changed: {name}")
    print(f"PASS {name}: {decoded.width}×{decoded.height}; zero changed pixels")

(output / "crops.json").write_text(json.dumps(crops, indent=2) + "\n")
