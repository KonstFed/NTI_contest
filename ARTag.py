from PIL import ImageColor, Image
import math
from matplotlib.pyplot import *
import random
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
    xV = round(xV/lenV*2)
    yV = round(yV/lenV*2)
    yV1 = yV
    yV = -xV
    xV =  yV1
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
            if Grayscale[yW][xW] > Grayscale[y][x]:
                cnt+=1
            #im.putpixel((x, y), (255, 0, 0))
        cnt_all +=1
    return cnt/ cnt_all
def estimate(Coordinates):
    destiniton = 0
    for i in range(len(Coordinates)):
        p1 = Coordinates[i]
        p2 = Coordinates[(i+1)%4]
        destiniton += evaluation(p1[0],p1[1],p2[0],p2[1])
    return destiniton/4
def showCoordinates(Coordinates, img):
    masx = []
    masy = []
    

    for i in range(len(Coordinates)):
        masx.append(Coordinates[i][0])
        masy.append(Coordinates[i][1])
    masx.append(Coordinates[0][0])
    masy.append(Coordinates[0][1])

    figure()
    imshow(img)
    plot(masx,masy,"r")
    xlabel('x')
    ylabel('y')
    title('Example')
    
    show()        
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

# # im.putpixel((0, 0), (255, 255, 255)) #Окрасит точку (0, 0) в цвет (255, 255, 255)
# # im.putpixel((0, 0), ImageColor.getcolor('#FFFFFF', 'RGB')) #Выполнит тоже самое
def findLocalMax():

    global Coordinates
    max1 = 0.0
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
def find_dist(x1,y1,x2,y2):
    return math.sqrt((x2 - x1)*(x2-x1) + (y2 - y1)*(y2-y1))
print (find_dist(2,2,3,3))
def copyArray(array2):
    array1 = []
    for i in range(len(array2)):
        array1.append([])
        for j in range(len(array2[i])):
            array1[i].append(array2[i][j])
    return array1
im.save('C:/PRG/tmp/photo.bmp')

evual = 0.0
max1 = 0.0
rang = [-10,10]
maxX = -1
maxY = -1
CoordinatesOld = []
deсision = []
#Coordinates = [[int(width/2 - width/10),int(heigth/2 - heigth/10)],[int(width/2 - width/10),int(heigth/2 + heigth/10)],[int(width/2 + width/10),int(heigth/2 + heigth/10)],[int(width/2 + width/10),int(heigth/2 - heigth/10)]]
First = [[int(width/2),int(heigth/2)],[int(width/2 ),int(heigth/2)],[int(width/2),int(heigth/2)],[int(width/2),int(heigth/2)]]
##[[10,0],[170,0],[170,230],[14,230]]
for g in range(500):
    Coordinates = copyArray(First)
    
    for i in range(len(Coordinates)):
        # startX = Coordinates[i][0] 
        # startY = Coordinates[i][1] 

        # differentX = min(abs(Coordinates[i][0] - width),Coordinates[i][0])
        # differentY = min(abs(Coordinates[i][1] - heigth),Coordinates[i][1])
        #dy = random.randint(min(-differentY,differentY),max(-differentY,differentY))
        #dx = random.randint(min(-differentX,differentX),max(-differentX,differentX))
        dopusk=30
        if i == 0:
            dx = random.randint(-dopusk,int(width/2)-1)
            dy = random.randint(-dopusk,int(heigth/2)-1) 
        elif i == 1:
            dx = random.randint(int(width/2)+1,width+dopusk)
            dy = random.randint(-dopusk,int(heigth/2)-1)         
        elif i == 2:
            dx = random.randint(int(width/2)+1,width+dopusk)
            dy = random.randint(int(heigth/2)+1,heigth+dopusk) 
        elif i == 3:
            dx = random.randint(-dopusk,int(width/2)-1)
            dy = random.randint(int(heigth/2)+1,heigth+dopusk)          
        Coordinates[i][0] = dx 
        Coordinates[i][1] = dy 
    #satisfy = True
    # for i in range(len(Coordinates)):
    #     p1 = Coordinates[i]
    #     p2 = Coordinates[(i+1)%4]
    #     destiniton += evaluation(p1[0],p1[1],p2[0],p2[1])
    #     if find_dist(p1[0],p1[1],p2[0],p2[1])<25:
    #         satisfy = False
    #         break
    # #showCoordinates(Coordinates, im)
    # if satisfy:
    #showCoordinates(Coordinates, im)
    curMaxEst = findLocalMax()
    if curMaxEst > max1:
        max1 = curMaxEst
        deсision =copyArray(Coordinates)
    else:
        Coordinates =copyArray(CoordinatesOld)
    # else:
    #     Coordinates =copyArray(CoordinatesOld)



showCoordinates(deсision, im)

print (max1)