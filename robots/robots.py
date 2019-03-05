from PIL import ImageColor, Image
import math
from matplotlib.pyplot import *
import random


labs=[['ULR','LU','U','UR','LU','UD','UD','UR'],\
['LR','LD','RD','LR','L','RDU','LU','RD'],\
['L','UD','U','RD','LR','UL','R','LUR'],\
['LR','LU','','UD','D','D','R','LR'],\
['LR','L','D','UR','LU','UR','LR','LR'],\
['LR','LDR','LUR','LR','LR','LR','LR','LR'],\
['L','UD','DR','LR','LRD','L','','R'],\
['LD','UD','UD','D','DU','DR','LD','DR']]

def left(cdir):
    if cdir=='U':
        return 'L'
    elif cdir=='L':
        return 'D'
    elif cdir=='R':
        return 'U'
    elif cdir=='D':
        return 'R'

def right(cdir):
    if cdir=='U':
        return 'R'
    elif cdir=='L':
        return 'U'
    elif cdir=='R':
        return 'D'
    elif cdir=='D':
        return 'L'


def drawlab():
    global N,robots, stack
    # return
    figure()
    w=20
    for row in range(len(labs)):
        for col in range(len(labs[row])):
            if 'L' in labs[row][col]:
                plot([col*w+1, col*w+1],[8*w-row*w,8*w-(row+1)*w],"b") 
            if 'R' in labs[row][col]:
                plot([(col+1)*w-1, (col+1)*w-1],[8*w-row*w,8*w-(row+1)*w],"b") 
            if 'U' in labs[row][col]:
                plot([col*w, (col+1)*w],[8*w-row*w+1,8*w-row*w+1],"b")   
            if 'D' in labs[row][col]:
                plot([col*w, (col+1)*w],[8*w-(row+1)*w-1,8*w-(row+1)*w-1],"b")
    # for nn in range(N):

    #     x, y, d, xe, ye = robots[nn]
    #     wy= y * w + w/2
    #     wx = x * w + w/2
    #     plot([wx + 5, wx - 5, wy+5, wy - 5],"r")
    #     plot([wx - 5, wx + 5, wy - 5, wy + 5],"r")
    for s in stack:
        for x, y, d, path in s:
            wy= 8*w - y * w - w/2
            wx = x * w + w/2
            plot([wx + 4, wx - 4], [wy+4, wy - 4],"ro")


    
    
    show()

def bfs(s):
    global labs,ends,stack

    stack = [s]
 # добавляем начальную вершину в очередь

    minpath=''
    while stack:
 # пока там что-то есть
        robotstate = stack.pop(0)
 # извлекаем вершину
        allacts=[]
        i=0
        finish=0
        allpath=''
        
        
        
        if len(minpath)>0:
            dd=0
            j=0
            for x, y, d, path in robotstate: 
                dd+=len(path)+abs(x-ends[j][0])+abs(y-ends[j][1])
                j+=1
            if dd>len(minpath):
                continue
        for x, y, d, path in robotstate:            
            acts=[] 
            allacts.append(acts)  
            if x==ends[i][0] and y==ends[i][1]:
                finish+=1
                acts.append([x,y,d,path])
                # print('finish',i)
                
                if len(results[i])==0 or len(results[i])>len(path):
                    results[i]=path
                all=True
                for r in results:
                    if r=='':
                        all=False
                        break
                    minpath+=r
                if not all:
                    minpath=''
                continue
            for a in 'FLR':
                if a=='F':
                    nd=d
                    npath=path+'F'
                elif a=='L':
                    nd=left(d)
                    npath=path+'L'
                else:
                    nd=right(d)
                    npath=path+'R'
                if nd in labs[y][x]:
                    continue
                nx=x
                ny=y

                if nd=='U':
                    ny=y-1
                elif nd=='D':
                    ny=y+1
                elif nd=='L':
                    nx=x-1
                elif nd=='R':
                    nx=x+1
                if levels[i][ny][nx]=='' or len(levels[i][ny][nx])+7>len(npath):
                    acts.append([nx,ny,nd, npath])
                    if levels[i][ny][nx]=='' or len(levels[i][ny][nx])>len(npath):
                        levels[i][ny][nx]=npath
            i+=1
        if finish==N:
            # print(1)
            return True
        for a1 in allacts[0]:
            if len(robotstate)>1:
                for a2 in allacts[1]:
                    if a1[0]==a2[0] and a1[1]==a2[1]:
                        continue
                    if robotstate[0][0]==a2[0] and robotstate[0][1]==a2[1] and robotstate[1][0]==a1[0] and robotstate[1][1]==a1[1]:
                        continue
                    if len(robotstate)>2:
                        for a3 in allacts[2]:
                            if (a1[0]==a3[0] and a1[1]==a3[1]) or (a2[0]==a3[0] and a2[1]==a3[1]):
                                continue
                            newrobotstate=[]
                            newrobotstate.append(a1)
                            newrobotstate.append(a2)
                            newrobotstate.append(a3)
                            stack.append(newrobotstate)
                            drawlab()
                    else:
                        newrobotstate=[]
                        newrobotstate.append(a1)
                        newrobotstate.append(a2)
                        stack.append(newrobotstate)
                        drawlab()
            else:
                newrobotstate=[]
                newrobotstate.append(a1)
                stack.append(newrobotstate)
                drawlab()

    return False
stack=[]
N = input()
N = int(N)
robots=[]
ends=[]
results=[]
levels=[]
for nn in range(N):
    x, y, d, xe, ye = input().split(" ")
    x = int(x)
    y = int(y)
    xe = int(xe)
    ye = int(ye)
    robots.append([x,y,d,''])
    ends.append([xe,ye])
    results.append('')
    levels.append([])
    for row in range(len(labs)):
            levels[nn].append([])
            for col in range(len(labs[row])):
                levels[nn][row].append('')
                
    
bfs(robots)
for nn in range(N):
    print(results[nn])
drawlab()