x1,y1 = input().split(" ")
x1 = int(x1)
y1 = int(y1)
x2,y2 = input().split(" ")
x2 = int(x2)
y2 = int(y2)
x3,y3 = input().split(" ")
x3 = int(x3)
y3 = int(y3)
A = x2 - x1
B = y2 - y1
C = x3 - x1
D = y3 - y1
E = A * (x1 + x2) + B * (y1 + y2)
F = C * (x1 + x3) + D * (y1 + y3)
G = 2 * (A * (y3 - y2) - B * (x3 - x2))
if G != 0:
    Cx = (D * E - B * F) / G
    Cy = (A * F - C * E) / G
    print(Cx,Cy)
else:
    print(-1)