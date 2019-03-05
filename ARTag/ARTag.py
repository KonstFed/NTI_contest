# from PIL import ImageColor, Image
import math
# from matplotlib.pyplot import *
import random

import numpy as np
eps = 0.000001

blackColor = 19

dictionary = {
    "0":0,
    "1":1,
    "2":2,
    "3":3,
    "4":4,
    "5":5,
    "6":6,
    "7":7,
    "8":8,
    "9":9,
    "A":10,
    "B":11,
    "C":12,
    "D":13,
    "E":14,
    "F":15
}
def HexToTen(s):
    global dictionary
    sum1= 0
    h = 0
    s1 = s[::-1]
    for i in range(len(s1)):
        sum1 = sum1 +  dictionary[s1[i]]*pow(16,h)
        h = h + 1
       
    return sum1
def compareRGB(r1,r2):
    sum1 = 0
    sum2 = 0
    for i in range(0,5,2):
        sum1 = sum1 + HexToTen(r1[i]+r1[i+1]) 
        sum2 = sum2 + HexToTen(r2[i]+r2[i+1]) 
    if r1 > r2:
        return r2
    else:
        return r1


def evaluation( x1=0, y1=0, x2=0, y2=0):
    
    global im,Grayscale,width,heigth
    xV = x2 - x1
    yV = y2 - y1
    dx = x2 - x1
    dy = y2 - y1
    
    lenV = math.sqrt(xV*xV+yV*yV)
    if lenV <10:
        return 0.0
    xV = round(xV/lenV*4)
    yV = round(yV/lenV*4)
    yV1 = yV
    yV = xV
    xV = - yV1

    yV2 = - yV
    xV2 = - xV
    sign_x = 1 if dx>0 else -1 if dx<0 else 0
    sign_y = 1 if dy>0 else -1 if dy<0 else 0
    cnt = 0
    cnt_all = 0
    if dx < 0: dx = -dx
    if dy < 0: dy = -dy
    
    if dx > dy:
        pdx, pdy = sign_x, 0
        es, el = dy, dx
    else:
        pdx, pdy = 0, sign_y
        es, el = dx, dy
    
    x, y = x1, y1
    
    error, t = el/2, 0        
    
    #/setPixel(x, y)
    
    xW = x + xV
    yW = y + yV
    xW2 = x + xV2
    yW2 = y + yV2 
    if xW >= 0 and xW<width and yW>=0 and yW<heigth and xW2 >= 0 and yW2 >= 0 and xW2 < width and yW2<heigth and Grayscale[yW][xW] > Grayscale[yW2][xW2]:
        cnt+=1
        #im.putpixel((x, y), (255, 0, 0))

    cnt_all +=1
    while t < el:
        
        error -= es
        if error < 0:
            error += el
            x += sign_x
            y += sign_y
        
        else:
            x += pdx
            y += pdy
        t += 1
        xW = x + xV
        yW = y + yV
        xW2 = x + xV2
        yW2 = y + yV2
        if xW >= 0 and xW<width and yW>=0 and yW<heigth and yW2 >= 0 and yW2 >= 0 and xW2 < width and yW2<heigth :
            if not likecolor (Grayscale[yW][xW], Grayscale[yW2][xW2]):
                cnt+=1
            #im.putpixel((x, y), (255, 0, 0))
        cnt_all +=1
    
    dif=cnt/ cnt_all
    return dif
def estimate(Coordinates):
    destiniton = 0
    for i in range(len(Coordinates)):
        p1 = Coordinates[i]
        p2 = Coordinates[(i+1)%4]
        destiniton += evaluation(p1[0],p1[1],p2[0],p2[1])
    return destiniton/4
def paralel(a1,a2):

    if abs(a1 - a2)>0.523599:
        return False
    else:
        return True
def find_in_range(ar,value):
    for i in ar:
        if abs(i - value)<5:
            return True
    return False
def dist_to_line(x,y,coefs):
    if len(coefs)== 1:
        return abs(coefs[0]-x)
    a = coefs[0]
    b = -1
    c = coefs[1]
    d = abs(a * x + b * y + c)/math.sqrt(a *a + b*b)
    return d
def distlines(line1,line2):
    if len(line1) == 1 and len(line2) > 1:
        x = line1[i][0]
        y =0
        return dist_to_line(x,y,line2)
    if len(line1) > 1 and len(line2) == 1:
        x = line2[i][0]
        y =0
        return dist_to_line(x,y,line1)
    if len(line1) == 1 and len(line2) == 1:        
        return abs(line1[i][0]-line2[i][0])
    x = 0
    y = line2[0]*x + line2[1]
    return dist_to_line(x,y,line2)
def showCoordinates():
    global coefLines,heigth,width,minEdge, im, blackColor
    masx = []
    masy = []
    mainL1 = 1000
    mainL2 = 1000
    # for h in Segments:
    #     masx.append(h[0])
    #     masy.append(h[1])
    #     masx.append(h[2])
    #     masy.append(h[3])
    # for i in range(len(Coordinates)):
    #     masx.append(Coordinates[i][0])
    #     masy.append(Coordinates[i][1])
    # if len(Coordinates)>0:
    #     masx.append(Coordinates[0][0])
    #     masy.append(Coordinates[0][1])
    Line1 = []
    Line2 = []
    angles=[]
    for i in range(len(coefLines)):
        cur = coefLines[i]

        if len(cur)==1:
            curAngle = 1.5708
        else:
            curAngle = math.atan(cur[0])
        found=False
        for a in angles:
            if abs(a[0] - curAngle)< 0.2:
                a[1]+=1
                found=True
                break
        if not found:
            mainL1 = curAngle
            angles.append([curAngle,1])
    if len(angles)<2:
        return -1
    angles = sorted(angles, key = lambda s:s[1])
    mainL1=angles[0][0]
    mainL2=angles[1][0]

    # figure()
    # imshow(im)
    for i in range(len(coefLines)):
        cur = coefLines[i]
        
        if len(cur) != 1:    
            curb = cur[1]
            curAngle = math.atan(cur[0])
           
            if abs(cur[0])<eps:
                y1 = cur[1]
                y2 = y1
                x1 = 0
                x2= width
            elif abs(cur[0]) < 1:
                x1 = 0
                x2 = width
                y1 =  cur[1]
                y2 = cur[0]*width+cur[1]
            else:
                x1 = (0-cur[1])/cur[0]
                x2 = (heigth-cur[1])/cur[0]
                y1 = 0
                y2 = heigth
            
        else:
            curAngle = 1.5708
            x1 = cur[0]
            x2 = x1
            y1 = 0
            y2 = heigth
        bias = minEdge/2
        flag = True  
        if paralel(curAngle,mainL1):
            for h in range(len(Line1)):
                if dist_to_line(x1,y1,Line1[h])<bias:
                    flag = False
                    break
            if flag:                
                Line1.append(cur)
                # plot([x1,x2],[y1,y2],"g")
        else:
            for h in range(len(Line2)):
                if dist_to_line(x1,y1,Line2[h])<bias:
                    flag = False
                    break
            if flag:
                Line2.append(cur)
                # plot([x1,x2],[y1,y2],"b")


    sortline1=[]
    for i in range(len(Line1)):
        if abs(mainL1) > 0.7:
            if len(Line1[i]) == 1 :
                x = Line1[i][0] 
                #sortline1.append([x, Line1[i]])
            else:
                x = (0-Line1[i][1])/Line1[i][0]
        else:
                x = Line1[i][1]
        sortline1.append([x, Line1[i]])
    sortline1 = sorted(sortline1,key = lambda s: s[0])
    # if len(sortline1)<4:
    #     # вычисление минимального расстояния между линиями
    #     dist1=width
    #     dists=[]
    #     for i in range(len(sortline1)-1):
    #         cd=distlines(sortline1[i][1], sortline1[i+1][1])
    #         dists.append(cd)
    #         if dist1>cd:
    #             dist1=cd
    #     for i in range(len(sortline1)-1):
    #         if dists[i]/dist1>1.5:
    #             if len(sortline1[i][1]==1):
    #                 x=(sortline1[i][1]+sortline1[i+1][1])/2
    #                 sortline1.append([x, [x]])
    #             else:
    #                 x1 = 0
    #                 y1 = sortline1[i][1][0]*x1 + sortline1[i][1][1]
    #                 x2 = 0
    #                 y2 = sortline1[i][1][0]*x2 + sortline1[i][1][1]
    #                 xc= (x1+x2)/2
    #                 yc= (y1+y2)/2
    #                 nk=sortline1[i][1][0]
    #                 nb=nk*xc - yc
    #                 if abs(mainL1) > 0.7:
    #                     x = (-nb)/nk
    #                 else:
    #                     x = nb
    #                 sortline1.append([x, [nk,nb]])

                # sortline1.append([x, Line1[i]])
    sortline2=[]
    for i in range(len(Line2)):
        if abs(mainL2) > 0.7:
            if len(Line2[i]) == 1 :
                x = Line2[i][0] 
                sortline2.append([x, Line2[i]])
            else:
                x = (0-Line2[i][1])/Line2[i][0]
        else:
                x = Line2[i][1]
        sortline2.append([x, Line2[i]])
    sortline2 = sorted(sortline2,key = lambda s: s[0])
    # if len(sortline1) != 4:
        
    #     i = 0
    #     j = 0
    #     x1 = (sortline2[j][1][1] - sortline1[i][1][1] )/(sortline1[i][1][0] - sortline2[j][1][0] )
    #     y1 = x1 * sortline1[i][1][0] + sortline1[i][1][1]
    #     j = len(sortline2)-1
    #     x2 = (sortline2[j][1][1] - sortline1[i][1][1] )/(sortline1[i][1][0] - sortline2[j][1][0] )
    #     y2 = x2 * sortline1[i][1][0] + sortline1[i][1][1]        
    #     if x1 > x2:
    #         tmpx =  x2
    #         x2 = x1
    #         x1 = tmpx
    #         tmpy = y2
    #         y2 = y1
    #         y1 = tmpy
    #     if abs(mainL1 )< 0.7:
    #         while x1 > 0:
    #             x1 = x1 - 1
    #             y1 = x1 * sortline1[0][1][0] + sortline1[0][1][1]
    #             if likecolor(Grayscale[y1][x1],blackColor):
    #                 continue
    #             else:
    #                 k = sortline2[0][1][0]
    #                 b = y1 - k * x1
    #                 sortline2.append([x1,[k,b]])
    #                 break
    #         while x2 < width:
    #             x2 = x2 + 1
    #             y2 = x2 * sortline1[0][1][0] + sortline1[0][1][1]
    #             if likecolor(Grayscale[y2][x2],blackColor):
    #                 continue
    #             else:
    #                 k = sortline2[0][1][0]
    #                 b = y1 - k * x2
    #                 sortline2.append([x2,[k,b]])
    #                 break
    matrix = [[1,1,1],[1,1,1],[1,1,1]] 
    # 1 is black
    if len(sortline1)==6:
        del sortline1[5]
        del sortline1[0]
    if len(sortline2)==6:
        del sortline2[5]
        del sortline2[0]

    for i in range(len(sortline1)-1):
        for j in range(len(sortline2)-1):
            if len(sortline1[i][1]) != 1 and len(sortline2[j][1]) != 1:
                x1 = (sortline2[j][1][1] - sortline1[i][1][1] )/(sortline1[i][1][0] - sortline2[j][1][0] )
                y1 = x1 * sortline1[i][1][0] + sortline1[i][1][1]
                x2 = (sortline2[j+1][1][1] - sortline1[i+1][1][1] )/(sortline1[i+1][1][0] - sortline2[j+1][1][0] )
                y2 = x2 * sortline1[i+1][1][0] + sortline1[i+1][1][1]
                x= int((x1 + x2 )/ 2)
                y = int((y1 + y2)/2)
                if not(likecolor(getColorR(x,y), blackColor)):
                    matrix[i][j] = 0

    # xlabel('x')
    # ylabel('y')
    # title('Example')
    sum1 = matrix[0][0] + matrix[0][2] + matrix[2][0]+ matrix[2][2]
    # show()
    if sum1 != 3:
        return -1
    else:
        for i in range(3):
            if matrix[2][2] == 0:
                break
                 
            else:
                matrix = rotate(matrix)

        return(readMatrix(matrix)) 
def readMatrix(m):
    s = m[0][1] * 8 + m[1][0]*4+ m[1][2]*2 + m[2][1]
    return s
def move(m):
    m1 = [[1,1,1],[1,1,1],[1,1,1]]
    
    s = m[2][2]+ m[1][2]+m[0][2]
    if s == 3:
        for i in range(len(m)):
            for j in range(len(m[i])):
                m1[i][(j+1)%3] = m[i][j]
        m = m1
    s = m[2][0]+ m[2][1]+m[2][2]
    if s == 3:
        for i in range(len(m)):
            for j in range(len(m[i])):
                m1[(i+1)%3][j]= m[i][j]
        m = m1


    return m
def rotate(m):
    m1 = [[0,0,0],[0,0,0],[0,0,0]]
    for i in range(len(m)):
        for j in range(len(m)):
            m1[j][2 - i] = m[i][j]
    return m1
def printMatrix(m):
    for i in m:
        for j in i:
            print(j,end = " ")
        print("")
    print("",end = "\n")
def getColorR(x,y):
    global Grayscale
    return Grayscale[y][x]
# # im.putpixel((0, 0), (255, 255, 255)) #Окрасит точку (0, 0) в цвет (255, 255, 255)
# # im.putpixel((0, 0), ImageColor.getcolor('#FFFFFF', 'RGB')) #Выполнит тоже самое
def findLocalMax():

    global Coordinates
    max1 = estimate(Coordinates)
    improve = True
    while improve:
        improve = False
        for i in range(len(Coordinates)):
            maxX = -1
            maxY = -1
            startX = Coordinates[i][0]
            startY = Coordinates[i][1]  
            for dx in rang:
                if dx == 0:
                    continue
                curx = startX + dx   
                cury =  startY
                if defind_side(Coordinates[(i+3)%4][0],Coordinates[(i+3)%4][1],Coordinates[(i+1)%4][0],Coordinates[(i+1)%4][1],curx,cury):
                    continue
                Coordinates[i][0] = curx
                est = estimate(Coordinates) 
                if est > max1:
                    max1 = est
                    maxX = curx
                    maxY= cury
            Coordinates[i][0] = startX
            for dy in rang:
                if dy == 0:
                    continue
                cury = startY + dy   
                curx =  startX
                if defind_side(Coordinates[(i+3)%4][0],Coordinates[(i+3)%4][1],Coordinates[(i+1)%4][0],Coordinates[(i+1)%4][1],curx,cury):
                    continue
                Coordinates[i][1] = cury
                est = estimate(Coordinates) 
                if est > max1:
                    max1 = est
                    maxX = curx
                    maxY= cury
            if maxX != -1:
                improve = True
                Coordinates[i][1] = maxY
                Coordinates[i][0] = maxX
            else:
                Coordinates[i][1] = startY
                Coordinates[i][0] = startX
    return max1
def appendLine(x1,y1,x2,y2):
    global coefLines,eps,minEdge
    dist =  math.sqrt((x1 - x2)*(x1 - x2) + (y1-y2)* (y1-y2))
    if dist < minEdge:
        minEdge = dist
    if abs(x1 - x2)<eps and abs:
        coefLines.append([x1])
    else:
        linek =  (y1 - y2)/(x1-x2)
        lineb = y1 - linek * x1
        coefLines.append([linek,lineb])
def appendBorder(x1,y1,x2,y2):
    global borders,eps,minEdge
    dist =  math.sqrt((x1 - x2)*(x1 - x2) + (y1-y2)* (y1-y2))
    if dist < minEdge:
        minEdge = dist
    if abs(x1 - x2)<eps and abs:
        borders.append([x1])
    else:
        linek =  (y1 - y2)/(x1-x2)
        lineb = y1 - linek * x1
        borders.append([linek,lineb])
def testRegion2(x,y,corners):
    Segments = []
    masCen=[]
    masCen=searchCorners(x,y, Grayscale,  width, heigth, corners)

    # for i in range(heigth):
    #     for j in range(width):
    #         if corners[i][j]==1:
    #             im.putpixel((j, i), ImageColor.getcolor('#00FFFF', 'RGB'))
    #         elif corners[i][j]==1:# Harris points
    #             im.putpixel((j, i), ImageColor.getcolor('#00FF00', 'RGB'))
    #         elif corners[i][j]==3:# Center of Harris points
    #             im.putpixel((j, i), ImageColor.getcolor('#0000FF', 'RGB'))
    #         elif corners[i][j]==7: # Harris points in region
    #             im.putpixel((j, i), ImageColor.getcolor('#FF0000', 'RGB'))
    # showCoordinates([], im)
    
    maxK = 1000000
    for i in range(len(masCen)):
        for j in range(i+1,len(masCen)):
            x1 = masCen[i][0]
            y1 = masCen[i][1]
            x2 = masCen[j][0]
            y2 = masCen[j][1]
            if find_dist(x1,y1,x2,y2)<10:
                continue
            e = evaluation(x1,y1,x2,y2)
            if e > 0.6:
                Segments.append([x1,y1,x2,y2])
                masCen[i].append(j)
                masCen[j].append(i)
            else:
                e = evaluation(x2,y2,x1,y1)    
                if e> 0.6:
                    Segments.append([x2,y2,x1,y1])
                    masCen[i].append(j)        
                    masCen[j].append(i)

    masCen2=[]
    for i in range(len(masCen)):
        if len(masCen[i])>= 4:
            masCen2.append([masCen[i][0], masCen[i][1],masCen[i][2], masCen[i][3], i])
    for i in range(len(masCen2)):
        found1=False
        found2=False
        for j in range(len(masCen2)):
            if masCen2[i][2]==masCen2[j][-1]:
                masCen2[i][2]=j
                found1=True
            if masCen2[i][3]==masCen2[j][-1]:
                masCen2[i][3]=j
                found2=True
        if not found2:
            del masCen2[i][3]        
        if not found1:
            del masCen2[i][2]


    Coordinates = []
    
    first=0    
    cur_p=first
    prev_p=-1

    if len(masCen2)==0:
        return []
    while cur_p!=-1:
        Coordinates.append([masCen2[cur_p][0],masCen2[cur_p][1]])
     
        tmp=cur_p
        if len(masCen2[cur_p])!=5:
            return []
        if masCen2[cur_p][2]==prev_p:
            cur_p=masCen2[cur_p][3]
        else:
            cur_p=masCen2[cur_p][2]
        prev_p=tmp
        if cur_p == first:
            break
    leng = len(Coordinates)
    for i in range(leng):
        x1 = Coordinates[i][0]
        y1 = Coordinates[i][1]

        y2 = Coordinates[(i+1)%leng][1]
        x2 = Coordinates[(i+1)%leng][0]

        appendLine(x1,y1,x2,y2)
    return Coordinates


def testRegion(masCen):    
    # masCen=[]
    # masCen=searchCorners(x,y, Grayscale,  width, heigth, corners)

    # for i in range(heigth):
    #     for j in range(width):
    #         if corners[i][j]==1:
    #             im.putpixel((j, i), ImageColor.getcolor('#00FFFF', 'RGB'))
    #         elif corners[i][j]==1:# Harris points
    #             im.putpixel((j, i), ImageColor.getcolor('#00FF00', 'RGB'))
    #         elif corners[i][j]==3:# Center of Harris points
    #             im.putpixel((j, i), ImageColor.getcolor('#0000FF', 'RGB'))
    #         elif corners[i][j]==7: # Harris points in region
    #             im.putpixel((j, i), ImageColor.getcolor('#FF0000', 'RGB'))
    # showCoordinates([], im)
    global im, blackColor, Grayscale
    # figure()
    # imshow(im)
    for i in range(len(masCen)):
        x0 = masCen[i][0]
        y0 = masCen[i][1]        
        for j in range(i+1,len(masCen)):
            x1 = masCen[j][0]
            y1 = masCen[j][1]
            d=find_dist(x0,y0,x1,y1)
            if d<10:
                continue
            par_index=-1
            d2=10000000
            for n in range(2,len(masCen[i])):
                pr=masCen[i][n]
                x2 = masCen[pr][0]
                y2 = masCen[pr][1]
                d2=find_dist(x0,y0,x2,y2)
                ax=x1 - x0
                ay=y1 - y0
                bx=x2 - x0
                by=y2 - y0
                l = math.atan((ax * by - ay*bx) / (ax*bx + ay*by))
                if abs(l)<0.2:
                    par_index=pr

            if par_index!=-1 and d<d2:
                continue

            e = evaluation(x0,y0,x1,y1)
            if e > 0.7:
                if par_index==-1:
                    # Segments.append([x0,y0,x1,y1])
                    masCen[i].append(j)                    
                elif par_index!=-1 and d>d2:                    
                    masCen[i].remove(par_index)
                    masCen[i].append(j)
       
    left=masCen[0][0]
    right=masCen[i][0]
    top=masCen[i][1]
    bottom=masCen[i][1]
    linepnts=[]
    for i in range(len(masCen)):
        x0 = masCen[i][0]
        y0 = masCen[i][1]
        if left>x0:
            left=x0
        if right<x0:
            right=x0
        if top<y0:
            top=y0
        if bottom>y0:
            bottom=y0            
        # if len(masCen[i])==4:
        for n in range(2,len(masCen[i])):
            x1 = masCen[masCen[i][n]][0]
            y1 = masCen[masCen[i][n]][1]                
            if [x0,y0,x1,y1] not in linepnts and [x1,y1,x0,y0] not in linepnts:
                linepnts.append([x0,y0,x1,y1])
                appendLine(x0,y0,x1,y1)
                # plot([x1,x0],[y1,y0],"g")
    
    # # searching borders
    # y=int((top + bottom) / 2)
    # y1 = y + 5    
    # x1=-1
    # for x in range(right+5, width):
    #     if not likecolor(blackColor, Grayscale[y1][x]):
    #         x1 = x
    #         break
    # y2 = y - 5
    # x2=-1
    # for x in range(right+5, width):
    #     if not likecolor(blackColor, Grayscale[y2][x]):
    #         x2 = x
    #         break
    
    # if x1!=-1 and x2!=-1:
    #     appendBorder(x2,y2,x1,y1)
    #     plot([x1,x2],[y1,y2],"r")
    # x1=-1
    # for x in range(left-5, 0,-1):
    #     if not likecolor(blackColor, Grayscale[y1][x]):
    #         x1 = x
    #         break
    # x2=-1
    # for x in range(left-5, 0,-1):
    #     if not likecolor(blackColor, Grayscale[y2][x]):
    #         x2 = x
    #         break
    
    # if x1!=-1 and x2!=-1:
    #     appendBorder(x2,y2,x1,y1)
    #     plot([x1,x2],[y1,y2],"r")
    

    # x=int((left + right) / 2)
    # x1 = y + 5    
    # y1=-1
    # for y in range(top+5, heigth):
    #     if not likecolor(blackColor, Grayscale[y][x1]):
    #         y1 = y
    #         break
    # x2 = x - 5
    # y2=-1
    # for y in range(top+5, heigth):
    #     if not likecolor(blackColor, Grayscale[y][x2]):
    #         y2 = y
    #         break
    
    # if y1!=-1 and y2!=-1:
    #     appendBorder(x2,y2,x1,y1)
    #     plot([x1,x2],[y1,y2],"b")
    # y1=-1
    # for y in range(bottom-5, 0,-1):
    #     if not likecolor(blackColor, Grayscale[y][x1]):
    #         y1 = y
    #         break
    # y2=-1
    # for y in range(left-5, 0,-1):
    #     if not likecolor(blackColor, Grayscale[y][x2]):
    #         y2 = y
    #         break
    
    # if y1!=-1 and y2!=-1:
    #     appendBorder(x2,y2,x1,y1)
    #     plot([x1,x2],[y1,y2],"b")


    
    # show()
    
    
def find_dist(x1,y1,x2,y2):
    return math.sqrt((x2 - x1)*(x2-x1) + (y2 - y1)*(y2-y1))
#print (find_dist(2,2,3,3))
def copyArray(array2):
    array1 = []
    for i in range(len(array2)):
        array1.append([])
        for j in range(len(array2[i])):
            array1[i].append(array2[i][j])
    return array1
#im.save('C:/PRG/tmp/photo.bmp')



def findCorners(img, width,height, window_size, k, thresh):
    """
    Finds and returns list of corners and new image with corners drawn
    :param img: The original image
    :param window_size: The size (side length) of the sliding window
    :param k: Harris corner constant. Usually 0.04 - 0.06
    :param thresh: The threshold above which a corner is counted
    :return:
    """

    #Find x and y derivatives
    dy, dx = np.gradient(img)
    Ixx = dx**2
    Ixy = dy*dx
    Iyy = dy**2
    # height = img.shape[0]
    # width = img.shape[1]

    cornerList = []
    # newImg = img.copy()
    # color_img = cv2.cvtColor(newImg, cv2.COLOR_GRAY2RGB)
    offset =int( window_size/2)

    #Loop through image and find our corners
    # print "Finding Corners..."
    for y in range(offset, height-offset):
        for x in range(offset, width-offset):
            #Calculate sum of squares
            windowIxx = Ixx[y-offset:y+offset+1, x-offset:x+offset+1]
            windowIxy = Ixy[y-offset:y+offset+1, x-offset:x+offset+1]
            windowIyy = Iyy[y-offset:y+offset+1, x-offset:x+offset+1]
            Sxx = windowIxx.sum()
            Sxy = windowIxy.sum()
            Syy = windowIyy.sum()

            #Find determinant and trace, use to get corner response
            det = (Sxx * Syy) - (Sxy**2)
            trace = Sxx + Syy
            r = det - k*(trace**2)

            #If corner response is over threshold, color the point and add to corner list
            if r > thresh:
                #print (x, y, r)
                cornerList.append([x, y, r])
                # color_img.itemset((y, x, 0), 0)
                # color_img.itemset((y, x, 1), 0)
                # color_img.itemset((y, x, 2), 255)
    return  cornerList

def likecolor(c1,c2):
    return abs(c1-c2)<20

def find_corner_center(corners):
    masCenPoint = []
    for i in range(heigth):
        corners.append([])
        for j in range(width):
            if corners[i][j] == 1:
                cnt = 0
                curmas = []
                current = corners[i][j]
                # masCorners[ind].append(corners[i].append(0))
                top = i
                bottom = i
                left = j
                right = j
                curmas.append([j,i])
                while len(curmas)>0:
                    current = curmas.pop(0)
                    corners[current[1]][current[0]] = 0
                    for x in range(current[0]-1,current[0]+2 ):
                        for y in range(current[1]-1,current[1]+2 ):
                            if(x == current[0] and y == current[1]):
                                continue
                            if x>=0 and x<width and y>=0 and y<heigth and corners[y][x] == 1 and not([x,y] in curmas):
                                cnt = cnt + 1
                                if x < left:
                                    left = x
                                if x > right:
                                    right = x
                                if y > top:
                                    top = y
                                if y < bottom:
                                    bottom = y

                                curmas.append([x,y])  
                if cnt>5:            
                    cenx = int((left + right)/2)
                    ceny = int((top + bottom)/2)
                    corners[ceny][cenx] = 3
                    masCenPoint.append([cenx,ceny])
    return masCenPoint
def searchCorners(ax,ay, img,  width,height, corners):
    cornerlist=[]
    objcolor=img[ay][ax]
    l_border=ax
    r_border=ax
    c_color=objcolor
    t_y=ay
    b_y=ay
    d=6
    while t_y>=0:
        n_x=-1
        c_color=objcolor
        while l_border>=0 and likecolor(objcolor,c_color):            
            if corners[t_y][l_border] in [1,3,7] and not([l_border,t_y] in cornerlist):
                cornerlist.append([l_border,t_y])  
                corners[t_y][l_border]=7
            # else:
            #     corners[t_y][l_border]=10
            l_border-=1
            if l_border<0:
                break
            c_color=img[t_y][l_border]
            if n_x==-1 and t_y>0 and likecolor(objcolor,img[t_y-1][l_border]):
                n_x=l_border
        for xx in range(l_border-1, l_border-d, -1):
            if xx<0:
                break
            if corners[t_y][xx] in [1,3,7] and not([xx,t_y] in cornerlist):
                cornerlist.append([xx,t_y])  
                corners[t_y][xx]=7
            # else:
            #     corners[t_y][xx]=10
        
        c_color=objcolor
        while r_border<width and likecolor(objcolor,c_color):
            #img[t_y][r_border]=500            
            if corners[t_y][r_border] in [1,3,7] and not([r_border,t_y] in cornerlist):
                cornerlist.append([r_border,t_y])
                corners[t_y][r_border]=7
            # else:
            #     corners[t_y][r_border]=10
            r_border+=1
            if r_border>=width:
                break
            c_color=img[t_y][r_border]  
            if n_x==-1 and t_y>0 and likecolor(objcolor,img[t_y-1][r_border]):
                n_x=r_border
        for xx in range(r_border+1, r_border+d):
            if xx>=width:
                break
            if corners[t_y][xx] in [1,3,7] and not([xx,t_y] in cornerlist):
                cornerlist.append([xx,t_y])  
                corners[t_y][xx]=7
            # else:
            #     corners[t_y][xx]=10
        if n_x==-1:
            break
        l_border=n_x
        r_border=n_x
        t_y-=1
    y=t_y-1
    for t_y in range(y,y-d,-1):
        if t_y<0:
            break
        for xx in range(l_border-3, r_border+3):
            if xx>=width:
                break
            if xx<0:
                continue
            if corners[t_y][xx] in [1,3,7] and not([xx,t_y] in cornerlist):
                cornerlist.append([xx,t_y])  
                corners[t_y][xx]=7
            # else:
            #     corners[t_y][xx]=10
    t_y=ay
    while t_y>=0:
        n_x=-1
        c_color=objcolor
        while l_border>=0 and likecolor(objcolor,c_color):
            #img[t_y][l_border]=500            
            if corners[t_y][l_border] in [1,3,7] and not([l_border,t_y] in cornerlist):
                cornerlist.append([l_border,t_y])
                corners[t_y][l_border]=7
            # else:
            #     corners[t_y][l_border]=10      
            l_border-=1
            if l_border<0:
                break
            c_color=img[t_y][l_border]
            if n_x==-1 and t_y<height-1 and likecolor(objcolor,img[t_y+1][l_border]):
                n_x=l_border
        for xx in range(l_border-1, l_border-d, -1):
            if xx<0:
                break
            if corners[t_y][xx] in [1,3,7] and not([xx,t_y] in cornerlist):
                cornerlist.append([xx,t_y])  
                corners[t_y][xx]=7
            # else:
            #     corners[t_y][xx]=10
        c_color=objcolor
        while r_border<width and likecolor(objcolor,c_color):
            #img[t_y][r_border]=500            
            if corners[t_y][r_border] in [1,3,7] and not([r_border,t_y] in cornerlist):
                cornerlist.append([r_border,t_y])
                corners[t_y][r_border]=7
            # else:
            #     corners[t_y][r_border]=10
            r_border+=1
            if r_border>=width:
                break
            c_color=img[t_y][r_border]  
            if n_x==-1 and t_y<height-1 and likecolor(objcolor,img[t_y+1][r_border]):
                n_x=r_border
        for xx in range(l_border-d, r_border+d):
            if xx>=width:
                break
            if xx<0:
                continue
            if corners[t_y][xx] in [1,3,7] and not([xx,t_y] in cornerlist):
                cornerlist.append([xx,t_y])  
                corners[t_y][xx]=7
            # else:
            #     corners[t_y][xx]=10
        if n_x==-1:
            break
        l_border=n_x
        r_border=n_x
        t_y+=1
    y=t_y+1
    for t_y in range(y, y+d):
        if t_y>=width-1:
            break
        for xx in range(l_border-d, r_border+d):
            if xx>=width:
                break
            if xx<0:
                continue
            if corners[t_y][xx] in [1,3,7] and not([xx,t_y] in cornerlist):
                cornerlist.append([xx,t_y])  
                corners[t_y][xx]=7
            # else:
            #     corners[t_y][xx]=10
    return cornerlist


def defind_side(ax,ay,bx,by,px,py):
    cur = (bx-ax)*(py-ay)-(by-ay)*(px-ax)
    return cur <= 0

def corect_rect(coords):
    for i in range(len(coords)):
        if find_dist(coords[i][0],coords[i][1],coords[(i+1)%4][0],coords[(i+1)%4][1])<10:
            return False
        if not defind_side(coords[i][0],coords[i][1],coords[(i+1)%4][0],coords[(i+1)%4][1], coords[(i+2)%4][0],coords[(i+2)%4][1]):
            return False
    return True
def SearchMaxWhite(r,grayscale,x,y):
    if x < r:
        dxDown = x
    else:
        dxDown = r
    if len(grayscale[0])-x < r:
        dxTop = len(grayscale[0])-x
    else:
        dxTop = r 
    if y < r:
        dyDown = y
    else:
        dyDown = r
    if len(grayscale) - y < r:
        dyTop = len(grayscale) - y
    else:
        dyTop = r
    maximus = Grayscale[y - dyDown][x - dxDown]
    maxCord = [x - dxDown,y - dyDown]
    for y1 in range(y - dyDown,y + dyTop):
        for x1 in range(x - dxDown,x + dxTop):
            if Grayscale[y1][x1]> maximus:
                maximus = Grayscale[y1][x1]
                maxCord = [x1,y1]
    return maxCord

image_cnt,heigth,width = input().split(" ")
heigth = int(heigth)
width = int(width)
Grayscales = []
fla = True
# ImageColor.getcolor('#FFFFFF', 'RGB') #Вернет (255, 255, 255)
for q in range(int(image_cnt)):
    # im = Image.new("RGB", (width, heigth))
    coefLines = []
    borders = []
    minEdge = heigth
    ImageMas = []
 
    Grayscales.append([])
    for i in range(heigth):
        Grayscales[q].append([])
        ImageMas.append(input().split(" "))

        for j in range(width):
            r = HexToTen(ImageMas[i][j][0:2])
            g = HexToTen(ImageMas[i][j][2:4])
            b = HexToTen(ImageMas[i][j][4:6])

            Grayscales[q][i].append(int(0.299 *r + 0.587 *g + 0.114 *b) )
for q in range(int(image_cnt)):    
    coefLines = []
    minEdge = heigth
    ImageMas = []
    Grayscale = Grayscales[q]
 
    
    destiniton = 0



    evual = 0.0
    max1 = 0.0
    rang = [-10,10]
    maxX = -1
    maxY = -1
    CoordinatesOld = []
    deсision = []
    #Coordinates = [[int(width/2 - width/10),int(heigth/2 - heigth/10)],[int(width/2 - width/10),int(heigth/2 + heigth/10)],[int(width/2 + width/10),int(heigth/2 + heigth/10)],[int(width/2 + width/10),int(heigth/2 - heigth/10)]]
    # First = [[45,105],[55,105],[55,95],[45,95]]
    # Coordinates = copyArray(First)
    # # curMaxEst = findLocalMax()

    # # max1 = curMaxEst
    # deсision =copyArray(Coordinates)
    #First = [[int(width/2),int(heigth/2)],[int(width/2 ),int(heigth/2)],[int(width/2),int(heigth/2)],[int(width/2),int(heigth/2)]]
    ##[[10,0],[170,0],[170,230],[14,230]]
    """ for g in range(150):
        for i in range(len(Coordinates)):
            startX = Coordinates[i][0] 
            startY = Coordinates[i][1]

            dopusk=17        
            dx = random.randint(-dopusk,dopusk)
            dy = random.randint(-dopusk,dopusk)        
            Coordinates[i][0] += dx 
            Coordinates[i][1] += dy
            if not corect_rect(Coordinates):
                Coordinates[i][0] = startX
                Coordinates[i][1] = startY
                continue
            curMaxEst = findLocalMax()
            if curMaxEst > max1:
                max1 = curMaxEst
                deсision =copyArray(Coordinates)
                #showCoordinates(deсision, im)
            else:
                Coordinates[i][0] = startX
                Coordinates[i][1] = startY """

    #print(defind_side(10,10,15,12,14,12))


    image = np.array(Grayscale)
    masG = findCorners(image,width,heigth,8,0.05,100000)
    cornerlist = sorted(masG, key=lambda k: k[2], reverse=True) 
    corners = []
    for i in range(heigth):
        corners.append([])
        for j in range(width):
            corners[i].append(0)

    for j in range(0,len(corners)):
        i = cornerlist[j]
        corners[i[1]][i[0]] = 1
    clist=find_corner_center(corners)


    # im = Image.new("RGB", (width, heigth))

    # for i in range(heigth):
    #     for j in range(width):
    #         if corners[i][j]==20:
    #             im.putpixel((j, i), ImageColor.getcolor('#00FF00', 'RGB'))
    #         elif corners[i][j]==1:# Harris points
    #             im.putpixel((j, i), ImageColor.getcolor('#00FF00', 'RGB'))
    #         elif corners[i][j]==3:# Center of Harris points
    #             im.putpixel((j, i), ImageColor.getcolor('#0000FF', 'RGB'))
    #         elif corners[i][j]==7: # Harris points in region
    #             im.putpixel((j, i), ImageColor.getcolor('#FF0000', 'RGB'))
    #         else:
    #             im.putpixel((j, i), (Grayscale[i][j], Grayscale[i][j],Grayscale[i][j]))
    # figure()
    # imshow(im)
    # show()
    # continue
    #showCoordinates([], im)
    ArrayCoord = []
    # Coordinates = testRegion(111, 163,corners)
    # ArrayCoord.append(Coordinates)
    testRegion( clist)
    # for i in range(heigth):
    #     for j in range(width):
    #         if corners[i][j] == 3:
    #             curWhite = SearchMaxWhite(1,Grayscale,j,i)

    #             testRegion(curWhite[0],curWhite[1],corners)
                #ArrayCoord.append(Coordinates)
                
                # for i in range(heigth):
                #     for j in range(width):
                #         if corners[i][j]==20:
                #             im.putpixel((j, i), ImageColor.getcolor('#00FF00', 'RGB'))
                #         elif corners[i][j]==1:# Harris points
                #             im.putpixel((j, i), ImageColor.getcolor('#00FF00', 'RGB'))
                #         elif corners[i][j]==3:# Center of Harris points
                #             im.putpixel((j, i), ImageColor.getcolor('#0000FF', 'RGB'))
                #         elif corners[i][j]==7: # Harris points in region
                #             im.putpixel((j, i), ImageColor.getcolor('#FF0000', 'RGB'))
                # showCoordinates(Coordinates, im)
    # for j in range(0,190):
    #     i = cornerlist[j]
    #     im.putpixel((i[0],i[1]),(255,255,0))
        

    # for j in clist:
    #     im.putpixel((j[1],j[0]),ImageColor.getcolor('#992298', 'RGB'))
    # for i in range(heigth):
    #     for j in range(width):
    #         if corners[i][j]==20:
    #             im.putpixel((j, i), ImageColor.getcolor('#00FF00', 'RGB'))
    #         elif corners[i][j]==1:# Harris points
    #             im.putpixel((j, i), ImageColor.getcolor('#00FF00', 'RGB'))
    #         elif corners[i][j]==3:# Center of Harris points
    #             im.putpixel((j, i), ImageColor.getcolor('#0000FF', 'RGB'))
    #         elif corners[i][j]==7: # Harris points in region
    #             im.putpixel((j, i), ImageColor.getcolor('#FF0000', 'RGB'))
    #         # elif corners[i][j]==10: # region
    #         #     im.putpixel((j, i), ImageColor.getcolor('#FF9800', 'RGB'))\
   

    res1 = showCoordinates()
    if res1 != -1:
        fla = False
        print(int(res1))
        break
    if not(fla):
        break
if fla:
    print (-1)

    
