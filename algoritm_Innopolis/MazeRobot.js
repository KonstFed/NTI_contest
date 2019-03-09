// function trik_way(x,y,dir,l,f,r)
// {
function addWay(maps,curRob,dataSens)
{    

    function direct_change(mainD,sensD){
    if (mainD == "L"){
        if (sensD == "R")return "U"
        else if (sensD == "F")return "L"
        else if (sensD == "L") return "D"
    }
    else if (mainD == "U"){
        if (sensD == "R")  return "R"
        else if (sensD == "F") return "U"
        else if (sensD == "L") return "L"
    }
    else if (mainD == "R"){
        if (sensD == "R") return "D"
        else if (sensD == "F") return "R"
        else if (sensD == "L") return "U"
    }
    else if (mainD == "D"){
        if (sensD == "R") return "L"
        else if (sensD == "F")  return "D"
        else if (sensD == "L")  return "R"
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
        // maps.unshift([{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0},{l:0,u:0,r:0,d:0}])
        upforCol(maps);
        curRob.x == 0;
        curRob.y == 0;
    }
    else if (curRob.x == -1 && curRob.y != -1)
    {
        upforCol(maps);
        curRob.x = 0;
    }
    else if (curRob.y == -1 && curRob.x != -1)
    {
        mas = []
        for (var c = 0; c <maps[0].length;c++)
        {
            up = -1
            if (maps[0][c].d !=-1)
            {
                up = maps[o][c].d
            }
            mas.push({l:-1,u:up,r:-1,d:-1});
        }
        maps.unshift(mas)
        curRob.y=0;
    }
    else if (curRob.y == maps.length && curRob.x != maps[0].length)
    {
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
        dwnforCol(maps);
    }
    else if (curRob.x == maps.length && curRob.y == maps[0].length)
    {
        
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
}  
function cleanMap(map)
{
    for (var js = 0; js<map.length;js++)
    {
        for (var is = 0; is<map[0].length;is++)
        {
            if (map[js][is].l == -1)
            {
                if (is != 0)
                {
                    map[js][is].l = map[js][is-1].r;
                }
            }
            if (map[js][is].r == -1)
            {
                if (is != map[0].length-1)
                {
                    map[js][is].r = map[js][is+1].l
                }
            }
            if (map[js][is].u == -1)
            {
                if (js != map.length-1)
                {
                    map[js][is].u = map[js+1][is].d
                }
            }
            if (map[js][is].d == -1)
            {
                if (js != 0)
                {
                    map[js][is].d = map[js-1][is].u

                }
            }
        }
    }
}
function isInMaze(masp)
{
   maze = [[{l: 1, u: 1, r: 0, d: 0},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 1, r: 0, d: 0},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 1, r: 1, d: 0},
{l: 1, u: 1, r: 1, d: 1},
{l: 1, u: 1, r: 1, d: 0}],


[{l: 1, u: 0, r: 1, d: 0},
{l: 1, u: 1, r: 1, d: 1},
{l: 1, u: 0, r: 1, d: 0},
{l: 1, u: 1, r: 1, d: 0},
{l: 1, u: 1, r: 1, d: 1},
{l: 1, u: 0, r: 0, d: 0},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 0, r: 1, d: 1}],


[{l: 1, u: 0, r: 0, d: 1},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 0, r: 1, d: 0},
{l: 1, u: 0, r: 0, d: 0},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 0, r: 1, d: 0},
{l: 1, u: 1, r: 1, d: 1},
{l: 1, u: 1, r: 1, d: 0}],


[{l: 1, u: 1, r: 1, d: 0},
{l: 1, u: 1, r: 1, d: 1},
{l: 1, u: 0, r: 1, d: 0},
{l: 1, u: 0, r: 1, d: 1},
{l: 1, u: 1, r: 1, d: 1},
{l: 1, u: 0, r: 0, d: 0},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 0, r: 1, d: 0}],


[{l: 1, u: 0, r: 0, d: 0},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 0, r: 0, d: 0},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 1, r: 0, d: 0},
{l: 0, u: 0, r: 1, d: 0},
{l: 1, u: 1, r: 1, d: 1},
{l: 1, u: 0, r: 1, d: 1}],


[{l: 1, u: 0, r: 1, d: 1},
{l: 1, u: 1, r: 1, d: 1},
{l: 1, u: 0, r: 1, d: 0},
{l: 1, u: 1, r: 1, d: 1},
{l: 1, u: 0, r: 0, d: 1},
{l: 0, u: 0, r: 0, d: 0},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 1, r: 1, d: 0}],


[{l: 1, u: 1, r: 0, d: 0},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 0, r: 0, d: 0},
{l: 0, u: 1, r: 1, d: 0},
{l: 1, u: 1, r: 1, d: 1},
{l: 1, u: 0, r: 1, d: 1},
{l: 1, u: 1, r: 1, d: 1},
{l: 1, u: 0, r: 1, d: 0}],


[{l: 1, u: 0, r: 1, d: 1},
{l: 1, u: 1, r: 1, d: 1},
{l: 1, u: 0, r: 0, d: 1},
{l: 0, u: 0, r: 0, d: 1},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 1, r: 0, d: 1},
{l: 0, u: 0, r: 1, d: 1}]]
    function compareCage(c1,c2)
    {
        m1 = [c1.l,c1.r,c1.u,c1.d];
        m2 = [c2.l,c2.r,c2.u,c2.d];
        for (var z = 0; z < m1.length;z++)
        {
            if (m1[z] == -1 || m2[z] == -1)
            {
                continue;
            }
            else{
                if (m1[z] != m2[z])
                {
                    return false;
                }
            }
        }
        return true;
    }
    answ = []
    for (row = 0;row<maze.length - maps.length;row++)
    {
        for (col = 0;col<maze[0].length - masp[0].length;col++)
        {
            flag = true
            // var j = 0;
            // var i = 0;
            for (y = row;y<row+masp.length;y++)
            {
                for (var x = col; x < col+masp[0].length;x++)
                {
                    if (!compareCage(masp[y-row][x-col],maze[row][col]))
                    {
                        flag = false;
                        break
                        
                    }
                    // i++
                }
                if (!flag) break;
                // j++
            }
            if (flag)
            {
                answ.push({y:row,x:col}) // Ответ это координаты точки 0 0 для мэпа
            }

        }
    }
    if (answ.length==1)
    {
        return answ[0]

    }
    else{
        return {y:-1,x:-1};

    }
} 
function rotateMatrix(matrix)
    {
        m1 = [];
        for (var i = 0; i<matrix.length;i++)
        {
            m1.push([]);
            for (var j = 0;j<matrix.length;j++)
            {
                m1[i].push(0)
            }
        }
        for (var j = 0; i<matrix.length;i++)
        {
            for (var i = 0;j<matrix[0].length;j++)
            {
                m1[i][matrix.length-1 - j].d = matrix[j][i].l
                m1[i][matrix.length-1 - j].l = matrix[j][i].u
                m1[i][matrix.length-1 - j].u = matrix[j][i].r
                m1[i][matrix.length-1 - j].r = matrix[j][i].d
            }
        }
        return (m1);
    }
function compareMap(maps)
{
    for (var qw = 0;qw<3;qw++)
    {
        cur = isInMaze(maps);
        if (cur.y!=-1){
            return cur
        }
        else
        {
            maps = rotateMatrix(maps);
        }
    }
    return {x:-1,y:-1}
}
maps = [[{l:-1,u:-1,r:-1,d:-1}]]

// fs = require("fs")
// var fileContent = fs.readFileSync("pol.txt", "utf8")
// fileContent = fileContent.split("\n");


rob = {x:x,y:y,dir:dir}
datsen = {l:l, f: f,r:r}
addWay(maps,rob,datsen)


// cleanMap(maps)
res = compareMap(maps)
if (res.y != -1)
{
    brick.display().addlable(res.x+" "+ res.y);
    brick.display.redraw();
    // console.log(maps.x+ " "+ maps.y)
}

// }
// maps = [[{l:1,u:0,r:0,d:1}]]
// addWay(maps,{x:0,y:1,dir:"U"},{r:0,f:1,l:0})
// addWay(maps,{x:0,y:1,dir:"R"},{r:0,f:0,l:1})
// addWay(maps,{x:1,y:1,dir:"R"},{r:0,f:0,l:1})
// addWay(maps,)

// for (var i = 0;i<maps.length;i++){
//     for (var j =0;j<maps[i].length;j++){
//         console.log(maps[i][j].l+" "+maps[i][j].u+" "+maps[i][j].r+" "+maps[i][j].d)
//     }
// }
// for i 