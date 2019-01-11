import math
# from PIL import ImageColor, Image
# from matplotlib.pyplot import *

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
inp = input().split(" ")
cnt_test = int(inp[0])
dt = int(inp[1])/1000
dataC = {

}
masrx = []
masry = []
angle = 0
x = 0
y = 0
colors = []
for i in range(cnt_test):
    inp = input().split(" ")
    v_line = float(inp[0])
    v_angle = float(inp[1])*1000
    dist = float(inp[2])
    color = inp[3]
    angl = v_angle * dt
    res = Find_point(v_line*dt,v_angle*dt,x,y,angle)
    masrx.append(x)
    masry.append(y) 

    
    if color != "000000" and dist!= 255:
        
        xc = x + math.cos(angle)*dist/1000
        yc = y + math.sin(angle)*dist/1000
        if color in colors:
            dataC[color].append([xc,yc])
        else:
            dataC[color] = [[xc,yc]]
            colors.append(color)
    x=  res[0]
    y = res[1]    
    angle += angl


def find_centr(x1,y1,x2,y2,x3,y3):
    A = x2 - x1
    B = y2 - y1
    C = x3 - x1
    D = y3 - y1
    E = A * (x1 + x2) + B * (y1 + y2)
    F = C * (x1 + x3) + D * (y1 + y3)
    G = 2 * (A * (y3 - y2) - B * (x3 - x2))
    if G!=0:
        Cx = (D * E - B * F) / G
        Cy = (A * F - C * E) / G
        return [Cx,Cy,True]
    return [0,0,False]

def maximus(r1,r2):
    s1 = convert_base(r1,10,16)
    s2 = convert_base(r2,10,16)
    if s1 > s2:
        return r1
    else:
        return r2
def minimus(r1,r2):
    s1 = convert_base(r1,10,16)
    s2 = convert_base(r2,10,16)
    if s1 < s2:
        return r1
    else:
        return r2    
def convert_base(num, to_base=10, from_base=10):
    # first convert to decimal number
    if isinstance(num, str):
        n = int(num, from_base)
    else:
        n = int(num)
    # now convert decimal to 'to_base' base
    alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if n < to_base:
        return alphabet[n]
    else:
        return convert_base(n // to_base, to_base) + alphabet[n % to_base]
def find_midle(data):
    masx = []
    masy = []
    for i in range(len(data)-2):
        for j in range(i+1,len(data)-1):
            for c in range(j+1,len(data)):
                res = find_centr(data[i][0],data[i][1],data[j][0],data[j][1],data[c][0],data[c][1])
                if res[2]:
                    masx.append(res[0])    
                    masy.append(res[1])
    rex= sum(masx)/len(data)
    rey= sum(masy)/len(data)
    return [rex,rey]            
def dist(x1,y1,x2,y2):
    return math.sqrt((x1 - x2)*(x1-x2)+ (y1-y2)*(y1 - y2))
answ = []
for i in range(len(colors)-1):
    cur = dataC[colors[i]]
    cen = find_centr(cur[0][0],cur[0][1],cur[1][0],cur[1][1],cur[2][0],cur[2][1])
    if cen[2]:
    # cen = find_midle(cur)
        for j in range(i+1,len(colors)):
            cur1 = dataC[colors[j]]
            cen1 = find_centr(cur1[0][0],cur1[0][1],cur1[1][0],cur1[1][1],cur1[2][0],cur1[2][1])
            if cen[2]:
            # cen1 = find_midle(cur1)
                if  dist(cen[0],cen[1],cen1[0],cen1[1])<0.04:
                    answ.append([minimus(colors[i],colors[j]),maximus(colors[i],colors[j]) ])

anws = sorted(answ,key = lambda s: s[0])
newansw = []
for i in anws:
    print(i[0],i[1])

# for i in range(len(anws)-1):
#     if answ[i][0]==answ[i+1][0]:
#         if answ[i][1]>answ[i+1][1]:
#             newansw+=[answ[i+1],answ[i]]
#         else:
#             newansw+=[answ[i],answ[i+1]]
#     else:
#         newansw+=[answ[i]]

# for i in newansw:
#     print(i)

# if len(answ)==1:
#     print(answ[0])


# im = Image.new("RGB", (1000, 1000))

# for i in range(len(colors)):
#     masx = []
#     masy = []
#     cur =dataC[colors[i]] 
#     for j in range(len(cur)):
#         masx.append(cur[j][0])
#         masy.append(cur[j][1])

#     figure()

#     plot(masx,masy,"ro")
#     xlabel('x')
#     ylabel('y')
#     title('one circle')
# #Выполнит тоже самое
# #

#     show()     
# figure()

# plot(masrx,masry,"r")
# xlabel('x')
# ylabel('y')
# title('robot move')   
# show()     
# A = x2 - x1
# B = y2 - y1
# C = x3 - x1
# D = y3 - y1
# E = A * (x1 + x2) + B * (y1 + y2)
# F = C * (x1 + x3) + D * (y1 + y3)
# G = 2 * (A * (y3 - y2) - B * (x3 - x2))
# if G != 0:
#     Cx = (D * E - B * F) / G
#     Cy = (A * F - C * E) / G
#     print(Cx,Cy)
# print(dataC)
