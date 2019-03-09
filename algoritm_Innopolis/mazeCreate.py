maze = []
print("LURD")
for i in range(8):
    maze.append([])
    for j in range(8):
        inp = input().split(" ")
        maze[i].append({"l":inp[0],"u":inp[1],"r":inp[2],"d":inp[3]})

for i in range(8):
    maze.append([])
    for j in range(8):
        print(str(maze[i][j])+",")
    
    print("\n")
# print(maze[0])