from matplotlib.pyplot import *
from PIL import ImageColor, Image

inp = input().split(" ")
height = int(inp[3])
width = int(inp[4])
im = Image.new("RGB", (width, height))

for i in range(height):
    data = input().split(" ")
    for j in range(width):
        cur = data[j]
        im.putpixel((j, i), ImageColor.getcolor("#"+cur, 'RGB')) #Выполнит тоже самое

figure()
imshow(im)
show()    