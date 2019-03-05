# from PIL import ImageColor, Image
import math
# from matplotlib.pyplot import *
def direct_change(mainD,sensD):
    if mainD == "L":
        if sensD == "R":
            return "U"
        elif sensD == "F":
            return "L"
        elif sensD == "L":
            return "D"
    elif mainD == "U":
        if sensD == "R":
            return "R"
        elif sensD == "F":
            return "U"
        elif sensD == "L":
            return "L"
    elif mainD == "R":
        if sensD == "R":
            return "D"
        elif sensD == "F":
            return "R"
        elif sensD == "L":
            return "U"
    elif mainD == "D":
        if sensD == "R":
            return "L"
        elif sensD == "F":
            return "D"
        elif sensD == "L":
            return "R"


def addwall(x,y,direct,mean):
    global maze
    variantsx = {
        "L":x - 1,
        "R":x + 1,
        "U":x,
        "D": x
    }
    variantsy = {
        "L":y,
        "R":y,
        "U":y - 1,
        "D": y + 1
    }
    revers = {
        "L":"R",
        "R":"L",
        "U":"D",
        "D":"U"
    }
    dopusk = True
    x1 = variantsx[direct]
    y1 = variantsy[direct]
    if x1 >= len(maze[0]) or x1 < 0:
        dopusk = False     
    if y1 >= len(maze) or y1<0:
        dopusk = False
    maze[y][x][direct] = mean
    if dopusk:
        maze[y1][x1][revers[direct]] = mean
def movef(x,y,d):
    if d == "L":
        x1 = x - 1
        y1 = y
    elif d == "U":
        x1 = x
        y1 = y - 1
    elif d == "R":
        x1 = x + 1
        y1 = y
    else:
        x1 = x
        y1 = y + 1
    return [x1,y1]    
def changeDir(maind,curd):
    if maind == "L":
        if curd == "L":
            return  "D"
        if curd == "R":
            return  "U"
    elif maind == "R":
        if curd == "L":
            return  "U"
        if curd == "R":
            return  "D"
        
    elif maind == "U":
        if curd == "L":
            return  "L"
        if curd == "R":
            return  "R"
    elif maind == "D":
        if curd == "L":
            return  "R"
        if curd == "R":
            return  "L"
# def drawMAZE(x,y):
#     global maze,im
#     rad =30
#     if maze[y][x]["L"] == 0:
#         for i in range(y*rad,y*rad + rad):
#             im.putpixel((x*rad, i), ImageColor.getcolor("#"+"00FF00", 'RGB')) #Выполнит тоже самое
#     if maze[y][x]["R"] == 0:
#         for i in range(y*rad,y*rad + rad):
#             im.putpixel((x*rad+rad, i), ImageColor.getcolor("#"+"00FF00", 'RGB')) #Выполнит тоже самое    
#     if maze[y][x]["U"] == 0:
#         for i in range(x*rad,x*rad + rad):
#             im.putpixel((i, y*rad), ImageColor.getcolor("#"+"00FF00", 'RGB')) #Выполнит тоже самое
#     if maze[y][x]["D"] == 0:
#         for i in range(x*rad,x*rad + rad):
#             im.putpixel((i, y*rad + rad), ImageColor.getcolor("#"+"00FF00", 'RGB')) #Выполнит тоже самое


#     if maze[y][x]["L"] == 1:
#         for i in range(y*rad,y*rad + rad):
#             im.putpixel((x*rad, i), ImageColor.getcolor("#"+"FF0000", 'RGB')) #Выполнит тоже самое
#     if maze[y][x]["R"] == 1:
#         for i in range(y*rad,y*rad + rad):
#             im.putpixel((x*rad+rad, i), ImageColor.getcolor("#"+"FF0000", 'RGB')) #Выполнит тоже самое    
#     if maze[y][x]["U"] == 1:
#         for i in range(x*rad,x*rad + rad):
#             im.putpixel((i, y*rad), ImageColor.getcolor("#"+"FF0000", 'RGB')) #Выполнит тоже самое
#     if maze[y][x]["D"] == 1:
#         for i in range(x*rad,x*rad + rad):
#             im.putpixel((i, y*rad + rad), ImageColor.getcolor("#"+"FF0000", 'RGB')) #Выполнит тоже самое

inp = input().split(" ")
numOfRob = int(inp[0])
width = int(inp[1])
height = int(inp[2])
cnt_tests = int(inp[3])
robots = []
# im = Image.new("RGB", (width*30+1,height*30+1))

for i in range(numOfRob):
    
    inp = input().split(" ")
    x = int(inp[0])
    y = int(inp[1])
    direct = inp[2]
    if i == 0:
        xst = x
        yst = y
    robots.append({
    "x": x,
    "y": y,
    "dir": direct,
    "data": []
    })
for i in range(numOfRob):
    data = []
    for j in range(cnt_tests):
        inp = input().split(" ")
        movement = inp[0]
        lsens = int(inp[1])
        fsens = int(inp[2])
        rsens = int(inp[3])
        data.append({
            "move":movement,
            "lsens":lsens,
            "fsens":fsens,
            "rsens":rsens
        })
    robots[i]["data"] = data[:]
maze = []

for i in range(height):
    maze.append([])
    for j in range(width):

        # im.putpixel((j, i), ImageColor.getcolor("#"+"FFFFFF", 'RGB')) #Выполнит тоже самое

        maze[i].append({"L":5,"U":5,"R":5,"D":5 })
for i in range(height):
    maze[i][0]["L"] = 1
    maze[i][len(maze[0])-1]["R"] = 1
for j in range(width):
    maze[0][j]["U"] = 1
    maze[len(maze)-1][j]["D"] = 1

        
    
# for i in range(height*30+1):
#     for j in range(width*30 + 1):

#         im.putpixel((j, i), ImageColor.getcolor("#"+"FFFFFF", 'RGB')) #Выполнит тоже самое
dcnt = 0
for i in range(numOfRob):
    for j in range(cnt_tests):
        curdata = robots[i]["data"][j]
        x = robots[i]["x"]
        y = robots[i]["y"]
        direct = robots[i]["dir"]
        if curdata["move"] == "F":
            if i == 0:
                dcnt +=1
            addwall(x,y,direct,0)
            res = movef(x,y,direct)
            robots[i]["x"] = res[0]
            robots[i]["y"] = res[1]
            addwall(res[0],res[1],direct,0)

        
        elif curdata["move"] == "L":
            robots[i]["dir"] = changeDir(direct,"L")

        else:
            robots[i]["dir"] = changeDir(direct,"R")
        x = robots[i]["x"]
        y = robots[i]["y"]
        direct = robots[i]["dir"]
        if curdata["lsens"] == 1:
            addwall(x,y,direct_change(direct,"L",),1)
        else:
            addwall(x,y,direct_change(direct,"L",),0)
        if curdata["fsens"] == 1:
            addwall(x,y,direct_change(direct,"F",),1)
        else:
            addwall(x,y,direct_change(direct,"F",),0)
            
        if curdata["rsens"] == 1:
            addwall(x,y,direct_change(direct,"R",),1)
        else:
            addwall(x,y,direct_change(direct,"R",),0)

        

# for i in range(height):
#     for j in range(width):

#         drawMAZE(j,i)
# # im.putpixel((90,100), ImageColor.getcolor("#"+"FF0000", 'RGB')) #Выполнит тоже самое
# figure()
# imshow(im)
# show()    
cnt = 0

prizoners = []
was = []
curmas = [[xst,yst]]
while len(curmas)!= 0:
    cur = curmas.pop(0)
    if not(cur in was):
        cnt+=1
        xc = cur[0]
        yc = cur[1]

        if maze[yc][xc]["L"] == 0 and xc>0 and not([xc-1,yc] in was):
            if [xc-1,yc] in prizoners:
                prizoners.remove( [xc-1,yc])
            curmas.append([xc - 1,yc])

        elif maze[yc][xc]["L"] == 5 and xc>0 and not([xc-1,yc] in prizoners):
            prizoners.append([xc-1,yc])

        if maze[yc][xc]["R"] == 0 and xc<len(maze[0])-1 and not([xc+1,yc] in was):
            if [xc+1,yc] in prizoners:
                prizoners.remove([xc+1,yc])
            curmas.append([xc + 1,yc])

        elif maze[yc][xc]["R"] == 5 and xc<len(maze[0])-1 and not([xc+1,yc] in prizoners):
            prizoners.append([xc+1,yc])

        if maze[yc][xc]["U"] == 0 and  yc>0 and not([xc,yc-1] in was):
            if [xc,yc-1] in prizoners:
                prizoners.remove([xc,yc-1])            
            curmas.append([xc,yc-1])

        elif maze[yc][xc]["U"] == 5 and  yc>0 and not([xc,yc-1] in prizoners):
            prizoners.append([xc,yc-1])
        if maze[yc][xc]["D"] == 0 and yc<len(maze)-1 and not([xc,yc+1] in was):
            if[xc,yc+1] in prizoners:
                prizoners.remove([xc,yc+1])     
            curmas.append([xc,yc+1])
   
        elif maze[yc][xc]["D"] == 5 and yc<len(maze)-1 and not([xc,yc+1] in was):
            prizoners.append([xc,yc+1])
                    # if [3,1] in curmas:
        #     print(cur)

        was.append([xc,yc])
f = True
for i in range(len(prizoners)):
    curx = prizoners[i][0]
    cury = prizoners[i][1]
    data = maze[cury][curx]
    if data["L"] == 0:
        continue
    elif data["R"] == 0:
        continue
    elif data["U"] == 0:
        continue
    elif data["D"] == 0:
        continue
    elif data["L"] == 1 and data["R"] == 1 and data["U"] == 1 and data["D"] == 1:
        continue
    else:
        f= False
        break
if f:
    print(cnt)
else:
    print(dcnt)



            




