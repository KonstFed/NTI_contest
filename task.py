from matplotlib.pyplot import *
import math


def Find_point(distanse, rotation, x1, y1, direct):
    if rotation == 0:
        x2 =x1 + distanse * math.cos(direct)
        y2 =y1 + distanse * math.sin(direct)
    else:
        
        radius = abs( distanse / rotation)
        
        x_forward = math.cos(direct) * radius
        y_forward = math.sin(direct) * radius
        
        if rotation < 0:
            x_forward2 = y_forward
            y_forward2 = -x_forward
            new_angle = direct + (math.pi / 2) + rotation
            
        else:
            x_forward2 = -y_forward
            y_forward2 = x_forward
            new_angle = direct - (math.pi / 2) + rotation
        
        cenx = x1 + x_forward2
        ceny = y1 + y_forward2
        #return [cenx,ceny]
        

        x2 =cenx + radius * math.cos(new_angle)
        y2 =ceny + radius * math.sin(new_angle)
    return [x2,y2]
def way (x1,y1,x2,y2):
    x1 = abs(x1)
    y1 = abs(y1)
    x1 = abs(x1)
    y2 = abs(y2)
    answer = abs(x1-x2) * abs(x1-x2)
    answer += abs(y1 - y2) * abs(y1 - y2)
    answer = math.sqrt(answer)
    return ( answer)

def intersection_of_lines(x1,y1,x2,y2,x3,y3,x4,y4):
    if x1 != x2 and x3 != x4:
        k1 = (y1-y2)/ (x1-x2)     
        b1 = y1 - k1 * x1

        k2 = (y3-y4)/(x3-x4)
        b2 = y3 - k2 * x3


        x = (b2- b1)/(k1-k2)
        y =  k1 * x + b1 
    elif x1 == x2 and x3 != x4:
        k2 = (y3-y4)/(x3-x4)
        b2 = y3 - k2 * x3
        x = x1
        y =  k2 * x + b2
    elif x1 != x2 and x3 == x4:
        k1 = (y1-y2)/ (x1-x2)     
        b1 = y1 - k1 * x1
        x = x3
        y =  k1 * x + b1
    else:
        return [False,0,0]
    if (x <= max(x1,x2) and x >= min(x1,x2)):
        if (x <= max(x3,x4) and x >= min(x3,x4)):
            return [True,x,y]
    return [False,0,0]
def test (x1,y1,x2,y2,points):
    
    for i in range(len(points)-2):
        b = (intersection_of_lines( x1, y1, x2 , y2, point[i][0], point[i][1],point[i+1][0],point[i+1][1]))
        if b[0]:
            return b        
    return [False,0,0]
def distantion(x1,y1,x2,y2):

    otv = abs(y1-y2)*abs(y1-y2) + abs(x1-x2)*abs(x1-x2)
    otv = pow(otv,0.5)
    return otv
    
def transform(s):
    m = s.split(",")
    n =int(m[0]) + int(m[1]) /len(m[1])
    return n 
#print(intersection_of_lines(0,0,1,2,4,2,5,0))
mas1 = [[133.902,0],[137.323,-0.02],[136.834,0],
[137.323,0.14],
[136.834,0.01],
[136.834,0.07],
[137.323,0.06],
[137.323,0.05],
[136.834,0],
[136.834,-0.2],
[137.323,-0.56],
[137.323,-0.66],
[136.834,-0.67],
[136.834,-0.65],
[137.323,-0.65],
[136.834,-0.57],
[137.323,-0.59],
[137.323,-0.51],
[136.834,-0.55],
[137.323,-0.58],
[136.834,-0.66],
[137.323,-0.69],
[136.834,-0.67],
[136.834,-0.56],
[137.323,-0.44],
[136.834,-0.35],
[137.323,-0.37],
[137.323,-0.34],
[136.834,-0.41],
[136.834,-0.47],
[137.323,-0.45],
[136.834,-0.45],
[137.323,-0.63]]
print("Введите количество тестов")
col = int(input())
print("Введите время тестов")
tim1 =  float(input())

point = []
point.append([0,0])
x = 0
direct = 0.0

y = 0
for i in range(len(mas1)):
    distance = mas1[i][0] * tim1
    rotation = mas1[i][1] * tim1
    prov = (Find_point( distance, rotation , x, y , direct))
    x=prov[0]
    y=prov[1]
    direct=direct+rotation
    xc = test(x,y,point[len(point)-1][0],point[len(point)-1][1],point)
    point.append(prov)
    if xc[0]:
        print(distantion(0,0,xc[1],xc[2]))
    


x_mas = []
y_mas = []
for i in point:
    x_mas.append(i[0])
    y_mas.append(i[1])



figure()
plot(x_mas,y_mas,'r')
xlabel('x')
ylabel('y')
title('Example')
show()
'''
tim1 =  0.5 #input()
accuracy = 5 #input()
direct = 0
points = [ ]
r = 0
x1, y1 = 0,0
for i in range(len(mas1)):
    if mas1[i][1] == 0:
        print(mas1[i][0])
        print(tim1)
        rad = mas1[i][0]*tim1
        points[i]= Find_point(rad,direct,x1,y1)
        continue
    line_speed = mas1[i][0]
    angle_speed = mas1[i][1]
    radius = line_speed / angle_speed
    b = 1
    for b in range(accuracy):
        if b == 0:
            continue
        else:
            angle = angle_speed * tim1 / accuracy * b + direct
            points[i].append(Find_point(radius,angle,x1,y1)) 
    points[i+1][0]= points[i][accuracy-1]
    x1 = points[i+1][0][0]
    y1 = points[i+1][0][0]
    direct += angle_speed * tim1
graf_x = [0]
graf_y = [0]
for z in range(len(points)):
    if len(points[z]) == 1:
        graf_x.append(points[z][0][0])
        graf_y.append(points[z][0][1])
    else:
        for n in range(len(points[z])):
            if n == 0:
                continue
            else:
                graf_x.append(points[z][n][0])
                graf_y.append(points[z][n][1])



figure()
plot(graf_x,graf_y,'r')
xlabel('x')
ylabel('y')
title('Example')
show()

    

'''


