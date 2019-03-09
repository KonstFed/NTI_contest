from PIL import Image
im = Image.open("src/TestShumes4.png")
rgb_im = im.convert('RGB')
r, g, b = rgb_im.getpixel((1, 1))
height = rgb_im.height
width = rgb_im.width
text_file = open("Output.txt", "w")
# text_file.write("1 {0} {1}\n".format(height, width))


# print (1,height,width)
for row in range(height):
    s = ""
    for col in range(width):
        r, g, b = rgb_im.getpixel((col,row))
        s = s + "{0:02x}{1:02x}{2:02x} ".format(r, g, b)
        # print("{0:02x}{1:02x}{2:02x}".format(r, g, b),end = " ")
    s = s + "\n"
    text_file.write(s)

    # print("\n")
text_file.close()