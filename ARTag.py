from PIL import ImageColor, Image
import math
from matplotlib.pyplot import *
import random
import numpy as np

def HexToTen(s):
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
    answ = ""
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
    if lenV == 0:
        return 0.0
    xV = round(xV/lenV*4)
    yV = round(yV/lenV*4)
    yV1 = yV
    yV = xV
    xV = - yV1
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
    if xW >= 0 and xW<width and yW>=0 and yW<heigth and x >= 0 and y >= 0 and x < width and y<heigth and Grayscale[yW][xW] > Grayscale[y][x]:
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
        if xW >= 0 and xW<width and yW>=0 and yW<heigth and x >= 0 and y >= 0 and x < width and y<heigth :
            if not likecolor (Grayscale[yW][xW], Grayscale[y][x]):
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
def showCoordinates(Coordinates, img):
    # global Segments
    masx = []
    masy = []
    # for h in Segments:
    #     masx.append(h[0])
    #     masy.append(h[1])
    #     masx.append(h[2])
    #     masy.append(h[3])
    for i in range(len(Coordinates)):
        masx.append(Coordinates[i][0])
        masy.append(Coordinates[i][1])
    if len(Coordinates)>0:
        masx.append(Coordinates[0][0])
        masy.append(Coordinates[0][1])

    figure()
    imshow(img)
    plot(masx,masy,"r")
    xlabel('x')
    ylabel('y')
    title('Example')
    
    show()        

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
def testRegion(x,y,corners):
    Segments = []
    masCen=[]
    clist=searchCorners(x,y, Grayscale,  width, heigth, corners)
    masCen = find_corner_center(corners)

    for i in range(len(masCen)):
        for j in range(i+1,len(masCen)):
            e = evaluation(masCen[i][0],masCen[i][1],masCen[j][0],masCen[j][1])
            if e > 0.6:
                Segments.append([masCen[i][0],masCen[i][1],masCen[j][0],masCen[j][1]])
                masCen[i].append(j)
                masCen[j].append(i)

            else:
                e = evaluation(masCen[j][0],masCen[j][1],masCen[i][0],masCen[i][1])    
                if e> 0.6:
                    Segments.append([masCen[j][0],masCen[j][1],masCen[i][0],masCen[i][1]])
                    masCen[i].append(j)        
                    masCen[j].append(i)

    Coordinates = []
    if len(masCen)==4:
        first=0
        for i in range(len(masCen)):
            if len(masCen[i])==4:
                first=i
                break
        next_p=masCen[first][2]
        cur_p=first
        prev_p=-1


        while cur_p!=-1:
            Coordinates.append([masCen[cur_p][0],masCen[cur_p][1]])
            tmp=cur_p
            if masCen[cur_p][2]==prev_p:
                cur_p=masCen[cur_p][3]
            else:
                cur_p=masCen[cur_p][2]
            prev_p=tmp
            if cur_p == first:
                break
    return Coordinates
    
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
            if corners[i][j] == 7:
            
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
                            if x>=0 and x<width and y>=0 and y<heigth and corners[y][x] == 7:
                                if x < left:
                                    left = x
                                if x > right:
                                    right = x
                                if y > top:
                                    top = y
                                if y < bottom:
                                    bottom = y

                                curmas.append([x,y])  
                             
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
    while t_y>=0:
        n_x=-1
        c_color=objcolor
        while likecolor(objcolor,c_color):            
            if corners[t_y][l_border]==1:
                cornerlist.append([t_y,l_border])  
                corners[t_y][l_border]=7
            else:
                corners[t_y][l_border]=10
            l_border-=1
            if l_border<0:
                break
            c_color=img[t_y][l_border]
            if n_x==-1 and t_y>0 and likecolor(objcolor,img[t_y-1][l_border]):
                n_x=l_border
        c_color=objcolor
        while likecolor(objcolor,c_color):
            #img[t_y][r_border]=500            
            if corners[t_y][r_border]==1:
                cornerlist.append([t_y,r_border])
                corners[t_y][r_border]=7
            else:
                corners[t_y][r_border]=10
            r_border+=1
            if r_border>=width:
                break
            c_color=img[t_y][r_border]  
            if n_x==-1 and t_y>0 and likecolor(objcolor,img[t_y-1][r_border]):
                n_x=r_border
        if n_x==-1:
            break
        l_border=n_x
        r_border=n_x
        t_y-=1
    t_y=ay
    while t_y>=0:
        n_x=-1
        c_color=objcolor
        while likecolor(objcolor,c_color):
            #img[t_y][l_border]=500            
            if corners[t_y][l_border]==1:
                cornerlist.append([t_y,l_border])
                corners[t_y][l_border]=7
            else:
                corners[t_y][l_border]=10      
            l_border-=1
            if l_border<0:
                break
            c_color=img[t_y][l_border]
            if n_x==-1 and t_y<height-1 and likecolor(objcolor,img[t_y+1][l_border]):
                n_x=l_border
        c_color=objcolor
        while likecolor(objcolor,c_color):
            #img[t_y][r_border]=500            
            if corners[t_y][r_border]==1:
                cornerlist.append([t_y,r_border])
                corners[t_y][r_border]=7
            else:
                corners[t_y][r_border]=10
            r_border+=1
            if r_border>=width:
                break
            c_color=img[t_y][r_border]  
            if n_x==-1 and t_y<height-1 and likecolor(objcolor,img[t_y+1][r_border]):
                n_x=r_border
        if n_x==-1:
            break
        l_border=n_x
        r_border=n_x
        t_y+=1
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


image_cnt,heigth,width = input().split(" ")
heigth = int(heigth)
width = int(width)
ImageColor.getcolor('#FFFFFF', 'RGB') #Вернет (255, 255, 255)
im = Image.new("RGB", (width, heigth))
ImageMas = []
for i in range(heigth):
    ImageMas.append(str(input()).split(" "))
Grayscale = []
for i in range(len(ImageMas)):
    Grayscale.append([])
    for j in range(len(ImageMas[i])):
        r = HexToTen(ImageMas[i][j][0:2])
        g = HexToTen(ImageMas[i][j][2:4])
        b = HexToTen(ImageMas[i][j][4:6])

        Grayscale[i].append(int(0.299 *r + 0.587 *g + 0.114 *b) )

destiniton = 0

for i in range(heigth):
    for j in range(width):
        color = '#'+hex(Grayscale[i][j])[2:]+hex(Grayscale[i][j])[2:]+hex(Grayscale[i][j])[2:]
        im.putpixel((j, i), ImageColor.getcolor(color, 'RGB')) #Выполнит тоже самое

evual = 0.0
max1 = 0.0
rang = [-10,10]
maxX = -1
maxY = -1
CoordinatesOld = []
deсision = []
#Coordinates = [[int(width/2 - width/10),int(heigth/2 - heigth/10)],[int(width/2 - width/10),int(heigth/2 + heigth/10)],[int(width/2 + width/10),int(heigth/2 + heigth/10)],[int(width/2 + width/10),int(heigth/2 - heigth/10)]]
First = [[45,105],[55,105],[55,95],[45,95]]
Coordinates = copyArray(First)
# curMaxEst = findLocalMax()

# max1 = curMaxEst
deсision =copyArray(Coordinates)
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
masG = findCorners(image,width,heigth,8,0.04,1000000)
cornerlist = sorted(masG, key=lambda k: k[2], reverse=True) 
corners = []
for i in range(heigth):
    corners.append([])
    for j in range(width):
        corners[i].append(0)

for j in range(0,190):
    i = cornerlist[j]
    corners[i[1]][i[0]] = 1


Coordinates = testRegion(10,200,corners)
# for j in range(0,190):
#     i = cornerlist[j]
#     im.putpixel((i[0],i[1]),(255,255,0))
    

# for j in clist:
#     im.putpixel((j[1],j[0]),ImageColor.getcolor('#992298', 'RGB'))

for i in range(heigth):
    for j in range(width):
        if corners[i][j]==20:
            im.putpixel((j, i), ImageColor.getcolor('#00FF00', 'RGB'))
        elif corners[i][j]==1:# Harris points
            im.putpixel((j, i), ImageColor.getcolor('#00FF00', 'RGB'))
        elif corners[i][j]==3:# Center of Harris points
            im.putpixel((j, i), ImageColor.getcolor('#0000FF', 'RGB'))
        elif corners[i][j]==7: # Harris points in region
            im.putpixel((j, i), ImageColor.getcolor('#FF0000', 'RGB'))
        # elif corners[i][j]==10: # region
        #     im.putpixel((j, i), ImageColor.getcolor('#FF9800', 'RGB'))
showCoordinates(Coordinates, im)

print (max1)