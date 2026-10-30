from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math

root = Path('public/images')
files = sorted(p for p in root.glob('*.jpg'))
thumb_w, thumb_h = 300, 200
cols = 4
rows = math.ceil(len(files) / cols)
sheet = Image.new('RGB', (cols * thumb_w, rows * (thumb_h + 28)), '#e9eef5')
draw = ImageDraw.Draw(sheet)
font = ImageFont.load_default(size=15)
for index, file in enumerate(files):
    img = Image.open(file).convert('RGB')
    img.thumbnail((thumb_w, thumb_h))
    x = (index % cols) * thumb_w
    y = (index // cols) * (thumb_h + 28)
    sheet.paste(img, (x + (thumb_w - img.width) // 2, y + (thumb_h - img.height) // 2))
    draw.text((x + 6, y + thumb_h + 5), file.stem, fill='#142d4e', font=font)
sheet.save('public/images/contact-sheet.jpg', quality=86)
print(sheet.size)
