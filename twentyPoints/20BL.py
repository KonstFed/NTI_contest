from matplotlib.pyplot import *
from PIL import ImageColor, Image
import math
dx = 0.0
dy = 0.0

def searchPoint(x,y,data1,data2,s=1):
    cur = data1[y][x]
    matrix = [[0,0,0],[0,0,0],[0,0,0]]
    if y == 0:
        downY = 0
        upY = y + s
    elif y == len(data1)-s:
        upY = len(data1) - 1
        downY = y - s
    else:
        downY = y - s
        upY = y + s        
    if x == 0:
        lx = 0
        rx = x + s
    elif x == len(data1[0])-s:
        lx = x - s
        rx = len(data1[0]-1)   
    else:
        lx = x - s 
        rx = x + s       
    i1 = 0
    j1 = 0
    for i in range(downY,upY+1):
        for j in range(lx,rx+1):
            matrix[i-downY][j - lx] = data1[i][j]
 
    for i in range(len(data2)):
        for j in range(len(data2[0])):
            if cur == data2[i][j]:

                x1 = j
                y1 = i
                res = check_matrix(x1,y1,data2,matrix)
                if res:
                    return [True,x1,y1]
                else:
                    continue
    return [False,0,0]
def rotate(m):
    m1 = [[0,0,0],[0,0,0],[0,0,0]]
    for i in range(len(m)):
        for j in range(len(m)):
            m1[j][2 - i] = m[i][j]
    return m1
def check_matrix(x1,y1,data2,matrix):
    # cnt=0
    # for j in range(0,len(matrix)):
    #     for i in range(0,len(matrix[j])):
    #         if matrix[j][i]==data2[x1+j-1][i+y1-1]:
    #             cnt++
    flag= True
    s = 1
    matrix1 = [[0,0,0],[0,0,0],[0,0,0]]
    if y1 == 0:
        downY1 = 0
        upY1 = y1 + s
    elif y1 == len(data2)-s:
        upY1 = len(data2) - 1
        downY1 = y1 - s
    else:
        upY1 = y1 + s
        downY1 = y1 - s

    if x1 == 0:
        lx1 = 0
        rx1 = x1 + s
    elif x1 == len(data2[0])-s:
        lx1 = x1 - s
        rx1 = len(data2[0]-1)   
    else:
        rx1 = x1 + s
        lx1 = x1 - s


    for i in range(downY1,upY1+1):
        for j in range(lx1,rx1+1):
            matrix1[i-downY1][j-lx1] = data2[i][j]
    # x = int((lx1 + rx1)/2)
    # y= int((upY1 + downY1)/2)
    for i in range(4):

        if matrix == matrix1:
            return True
        else:
            matrix1 = rotate(matrix1)
    return False
inp = input().split(" ")
n = int(inp[0])
h = int(inp[1])
a = int(inp[2])
height = int(inp[3])
width = int(inp[4])
data = []

lines = []
for c in range(n):
    data.append([])
    data[c] = input().split(" ")
    line = []

    for i in range(height):
        line.append([])
        for j in range(width):
            line[i].append(data[c][i*width+j])
    im = Image.new("RGB", (width, height))
    lines.append(line)
    for i in range(height):
        for j in range(width):
            im.putpixel((j, i),ImageColor.getcolor("#"+line[i][j], 'RGB')) #Выполнит тоже самое

    figure()
    imshow(im)


    show()
def adCoord(x1,y1,x2,y2):
    global dx,dy,a,h
    difx = x2 - x1
    dify = y2 - y1
    # dx = dx + difx
    # dy = dy + dify
    x = -difx 
    y = - dify
    l = 2 * h * math.tan(math.radians(a/2))
    lpx = l / width
    lpy = l / height
    dx += lpx * x
    dy += lpy * y

# cenx = int(width/2)
# ceny = int(height/2)
masp = [[1,2],[1,1],[1,width-2],[height-2,1],[height-2,width-2]]
cd = True

for i in range(n-1):
    for h1 in masp:
        res = searchPoint(h1[1],h1[0],lines[i],lines[i+1])
        if res[0]:
            adCoord(h1[1],h1[0],res[1],res[2])
            break
        else:
            continue

if cd:
    # x = -dx 
    # y = - dy
    # l = 2 * h * math.tan(math.radians(a/2))
    # lpx = l / width
    # lpy = l / height
    # print(round(lpx * x,1),round(lpy * y,1))
    print(round(dx,1),round(dy,1))
# print(cenx,ceny)
# print(res[1],res[2])
