function addWay(maps,curRob,dataSens,prox)
{    

    function direct_change(mainD,sensD){
    if (mainD == "L"){
        if (sensD == "R")return "U"
        else if (sensD == "F")return "L"
        else if (sensD == "L") return "D"
        else if (sensD == "D") return "R"
    }
    else if (mainD == "U"){
        if (sensD == "R")  return "R"
        else if (sensD == "F") return "U"
        else if (sensD == "L") return "L"
        else return "D"
    }
    else if (mainD == "R"){
        if (sensD == "R") return "D"
        else if (sensD == "F") return "R"
        else if (sensD == "L") return "U"
        else return "L"
    }
    else if (mainD == "D"){
        if (sensD == "R") return "L"
        else if (sensD == "F")  return "D"
        else if (sensD == "L")  return "R"
        else return "U"
    }
    }
    // function changeDir(maind,curd){
    // if (maind == "L"){
    //     if (curd == "L") return  "D"
    //     else if (curd == "R") return  "U"
    // }
    // else if (maind == "R"){
    //     if (curd == "L") return  "U"
    //     else if (curd == "R") return  "D"
    // }
    // else if (maind == "U"){
    //     if (curd == "L") return  "L"
    //     if curd == "R":
    //         return  "R"
    // }
    // elif maind == "D":
    //     if curd == "L":
    //         return  "R"
    //     if curd == "R":
    //         return  "L"
    // }
    function upforCol(maps)
    {
        for (var i = 0 ; i < maps.length;i++)
        {
            rme = -1
            if (maps[i][0].l != -1)
            {
                rme = maps[i][0].l;
            }
            maps[i].unshift({l:-1,u:-1,r:rme,d:-1});
            
        }
    }
    function dwnforCol(maps)
    {
        for (var i = 0 ; i < maps.length;i++)
        {
            lme = -1
            if (maps[i][maps[i].length-1].r != -1)
            {
                lme = maps[i][maps[i].length-1].r;
            }
            maps[i].push({l:lme,u:-1,r:-1,d:-1});
        }
    }
    
    if (curRob.x == -1 && curRob.y == -1)
    {
        mas = []
        for (var c = 0; c <maps[0].length;c++)
        {
            var up = -1
            if (maps[0][c].d !=-1)
            {
                up = maps[o][c].d
            }
            mas.push({l:-1,u:up,r:-1,d:-1});
        }
        maps.unshift(mas)
        for (var c = 0; c <prox[0].length;c++)
        {
            prox[c].push(0);
        }
        mas = []

        for (var c = 0; c <maps[0].length;c++)
        {
            
            mas.push(0);
        }
        prox.unshift(mas)
        // maps.unshift([{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0}])
        upforCol(maps);
        curRob.x == 0;
        curRob.y == 0;
    }
    else if (curRob.x == -1 && curRob.y != -1)
    {
        for (var c = 0; c <maps[0].length;c++)
        {
            
            mas.push(0);
        }
        prox.unshift(mas)

        upforCol(maps);
        curRob.x = 0;
    }
    else if (curRob.y == -1 && curRob.x != -1)
    {
        mas = []
        for (var c = 0; c <maps[0].length;c++)
        {
            var up = -1
            if (maps[0][c].d !=-1)
            {
                up = maps[o][c].d
            }
            mas.push({l:-1,u:up,r:-1,d:-1});
        }
        maps.unshift(mas)
        mas = []
        for (var c = 0; c <maps[0].length;c++)
        {
            
            mas.push(0);
        }
        prox.unshift(mas)
        curRob.y=0;
    }
    else if (curRob.y == maps.length && curRob.x != maps[0].length)
    {
        mas = []

        // for (var c = 0; c <maps[0].length;c++)
        // {
            
        //     mas.push(0);
        // }
        // prox.push(mas)
        for (var c = 0; c <maps[0].length;c++)
        {
            
            mas.push(0);
        }
        prox.push(mas)
        mas = []
        for (var c = 0; c <maps[0].length;c++)
        {
            down = -1;

            if (maps[maps.length-1][c].u!=-1)
            {
                down = maps[maps.length-1][c].u;
            }
            mas.push({l:-1,u:-1,r:-1,d:down})
        }
        maps.push(mas)
    }
    else if (curRob.x == maps[0].length && curRob.y != maps.length)
    {
        for (var c = 0; c <maps.length;c++)
        {
            
            prox.push(0);
        }
        dwnforCol(maps);
    }
    else if (curRob.x == maps.length && curRob.y == maps[0].length)
    {
        mas = []
        for (var c = 0; c <maps[0].length;c++)
        {
            
            mas.push(0);
        }
        prox.push(mas)
        for (var c = 0; c <maps.length;c++)
        {
            
            prox.push(0);
        }
        mas = []
        for (var c = 0; c <maps[0].length;c++)
        {
            down = -1;

            if (maps[maps.length-1][c].u!=-1)
            {
                down = maps[maps.length-1][c].u;
            }

            mas.push({l:-1,u:-1,r:-1,d:down});
        }
        maps.shift(mas)
        dwnforCol(maps);
    }
    // else
    // {
    //     cur =  direct_change(curRob.d,"L");
    //     if (maps[curRob.y][curRob.x+1].l == -1) maps[curRob.y][curRob.x+1].l
    // }
    if (dataSens.l == 1)
    {
        curdir = direct_change(curRob.dir,"L");
        if (curdir == "R")
        {
            maps[curRob.y][curRob.x].r = 1;
        }
        else if (curdir == "U") maps[curRob.y][curRob.x].u = 1;
        else if (curdir == "L") maps[curRob.y][curRob.x].l = 1;
        else if (curdir == "D") maps[curRob.y][curRob.x].d = 1;
    }
    else{
        curdir = direct_change(curRob.dir,"L");
        if (curdir == "R") maps[curRob.y][curRob.x].r = 0;
        else if (curdir == "U") maps[curRob.y][curRob.x].u = 0;
        else if (curdir == "L") maps[curRob.y][curRob.x].l = 0;
        else if (curdir == "D") maps[curRob.y][curRob.x].d = 0;
    }
    if (dataSens.f == 1)
    {
        curdir = direct_change(curRob.dir,"F");
        if (curdir == "R") maps[curRob.y][curRob.x].r = 1;
        else if (curdir == "U") maps[curRob.y][curRob.x].u = 1;
        else if (curdir == "L") maps[curRob.y][curRob.x].l = 1;
        else if (curdir == "D") maps[curRob.y][curRob.x].d = 1;
    }
    else{
        curdir = direct_change(curRob.dir,"F");
        if (curdir == "R") maps[curRob.y][curRob.x].r = 0;
        else if (curdir == "U") maps[curRob.y][curRob.x].u = 0;
        else if (curdir == "L") maps[curRob.y][curRob.x].l = 0;
        else if (curdir == "D") maps[curRob.y][curRob.x].d = 0;
    }
    if (dataSens.r == 1)
    {
        curdir = direct_change(curRob.dir,"R");
        if (curdir == "R") maps[curRob.y][curRob.x].r = 1;
        else if (curdir == "U") maps[curRob.y][curRob.x].u = 1;
        else if (curdir == "L") maps[curRob.y][curRob.x].l = 1;
        else if (curdir == "D") maps[curRob.y][curRob.x].d = 1;
    }
    else{
        curdir = direct_change(curRob.dir,"R");
        if (curdir == "R") maps[curRob.y][curRob.x].r = 0;
        else if (curdir == "U") maps[curRob.y][curRob.x].u = 0;
        else if (curdir == "L") maps[curRob.y][curRob.x].l = 0;
        else if (curdir == "D") maps[curRob.y][curRob.x].d = 0;
    }
    if (dataSens.d == 1)
    {
        curdir = direct_change(curRob.dir,"D");
        if (curdir == "R") maps[curRob.y][curRob.x].r = 1;
        else if (curdir == "U") maps[curRob.y][curRob.x].u = 1;
        else if (curdir == "L") maps[curRob.y][curRob.x].l = 1;
        else if (curdir == "D") maps[curRob.y][curRob.x].d = 1;
    }
    else{
        curdir = direct_change(curRob.dir,"D");
        if (curdir == "R") maps[curRob.y][curRob.x].r = 0;
        else if (curdir == "U") maps[curRob.y][curRob.x].u = 0;
        else if (curdir == "L") maps[curRob.y][curRob.x].l = 0;
        else if (curdir == "D") maps[curRob.y][curRob.x].d = 0;
    }
} 
function move()
{

}
function left(){}
function right(){}
eL() = // что то там left
eR() = //rigth
maps = [[]]
dir = "U";
x = 0;
y = 0;
mas = [[]]
function check(mas)
{
    for (var row = 0;row< mas.length;row++)
    {
        for (var col =0;col<mas[row].length;col++)
        {
            if (mas[row][col]>5)
            {
                return true
            }
        }
    }
}
while(true)
{
    
    l
    r
    f
    d
    addWay(maps,{x,y,dir},{l:l,f:f,d:d,r:r},mas);
    if (maps[y][x].l == 0)
    {
        move(-1,0);
        x = x -1;
        mas[y][x] += 1
    }
    else if (maps[y][x].r == 0)
    {
        move(1,0);
        x = x + 1;
        mas[y][x] += 1

    }
    else if (maps[y][x].d == 0)
    {
        move(0,-1);
        y = y - 1;
        mas[y][x] += 1

    }
    else if (maps[y][x].up == 0)
    {
        move(0,1);
        y = y + 1;
        mas[y][x] += 1

    }
    if (check(mas))
    {
        answ = "(" + x + "," + y + ")";
    }
}