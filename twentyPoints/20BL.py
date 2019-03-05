# from matplotlib.pyplot import *
# from PIL import ImageColor, Image
import math

import sys

dx = 0.0
dy = 0.0

def searchPoint(x,y,data1,data2,s=1):
    global width,height
    cur = data1[y][x]
    matrix = [[0,0,0],[0,0,0],[0,0,0]]


    for i in range(0,3):
        for j in range(0,3):
            vx=x+j-1
            vy=y+i-1
            if vx<0 or vx>=width or vy<0 or vy>=height:
                continue
            matrix[i][j] = data1[vy][vx]
 
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
        for j in range(len(m[0])):
            m1[j][2 - i] = m[i][j]
    return m1
def compareMatrix(m1,m2):
    for i in range(len(m1)):
        for j in range(len(m1)):
            if m1[i][j] != -1 and m2[i][j]!=-1 and m2[i][j] != m1[i][j]:
                return False
    return True
def check_matrix(x1,y1,data2,matrix):

    flag= True
    s = 1
    matrix1 = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]


    for i in range(0,3):
        for j in range(0,3):
            vx=x1+j-1
            vy=y1+i-1
            if vx<0 or vx>=width or vy<0 or vy>=height:
                continue
            matrix1[i][j] = data2[vy][vx]
    # x = int((lx1 + rx1)/2)
    # y= int((upY1 + downY1)/2)
    for i in range(4):

        if compareMatrix(matrix,matrix1):
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
    # im = Image.new("RGB", (width, height))
    lines.append(line)
    # for i in range(height):
    #     for j in range(width):
    #         im.putpixel((j, i),ImageColor.getcolor("#"+line[i][j], 'RGB')) #Выполнит тоже самое

    # figure()
    # imshow(im)


    # show()
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

cenx = int(width/2)
ceny = int(height/2)
masp = [[int(height/2),int(width/2)],[1,2],[1,1],[1,width-2],[height-2,1],[height-2,width-2]]
cd = True
f = False
if height >0 and width >0:
# masp = [[[int(height/2,int(width/2))]]
    for i in range(n-1):
        for d1 in masp:

            cenx = d1[0]
            ceny = d1[1]
            res = searchPoint(cenx,ceny,lines[i],lines[i+1])
            if res[0]:
                adCoord(cenx,ceny,res[1],res[2])
                break
    
    

if cd:
    # x = -dx 
    # y = - dy
    # l = 2 * h * math.tan(math.radians(a/2))
    # lpx = l / width
    # lpy = l / height
    # print(round(lpx * x,1),round(lpy * y,1))
    print(round(dx,1),round(dy,1))
    # print(dx,dy)
else:
    print(0.0,0.0)
# print(cenx,ceny)
# print(res[1],res[2])
