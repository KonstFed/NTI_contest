function mazeR(robsData,cntR)
{
    function left(cdir){
    if (cdir=='U') return 'L'
    else if (cdir=='L') return 'D'
    else if (cdir=='R') return 'U'
    else if (cdir=='D') return 'R'
    }
    function right(cdir){
    if (cdir=='U') return 'R'
    else if (cdir=='L') return 'U'
    else if (cdir=='R') return 'D'
    else if (cdir=='D') return 'L'
    }
function bfs(s,labs,ends,stack)
{
    N = 3;
    stack = [s]
    var minpath = ''
    while (stack.length>0)
    {
        robotstate = stack.shift();
        allacts = []
        i = 0;
        finish = 0

        if (minpath.length>0)
        {
            dd = 0;
            j = 0;
            for (var z = 0;z< robotstate;z++)
            {
                x = robotstate[z][0];
                y = robotstate[z][1];
                d = robotstate[z][2];
                path = robotstate[z][3];
                dd += path.length + Math.abs(x - ends[j][0])+Math.abs(y-ends[j][1])
                j++;
            }
            if (dd>minpath.length)
            {
                continue
            }
        }
        for (var z = 0;z< robotstate.length;z++)
        {
            x = robotstate[z][0];
            y = robotstate[z][1];
            d = robotstate[z][2];
            path = robotstate[z][3];
            acts = [];
            allacts.push(acts)

            if (x== ends[i][0] && y == ends[i][1]){
                finish += 1;
                acts.push([x,y,d,path]);
                if (results[i].length == 0 || results[i].length > path.length)
                {
                    results[i] = path;
                }
                all = true
                for (var raq = 0;raq < results.length;raq++)
                {
                    if (results[raq] == ''){
                        all = false;
                        break;
                    }
                    minpath = minpath + results[raq];
                }
                if (!all) 
                {
                    minpath = ''
                }
                continue
            }
            flr = ['F','L','R'];
            for (var curaa =0; curaa < flr.length;curaa++)
            {
                a = flr[curaa]
                if (a == 'F')
                {
                    nd = d;
                    npath = path + 'F'
                }
                else if (a == 'L')
                {
                    nd = left(d);
                    npath = path + 'L'
                }
                else if (a== "R") {
                    nd = right(d)
                    npath = path + 'R'

                }
                // else {
                //     nd = d;
                //     npath = path + 'S'
                // }
                if (labs[y][x].indexOf(nd)!= -1)
                {
                    continue
                }
                nx = x 
                ny = y;
                if (nd == 'U')
                {
                    ny = y - 1;
                }
                else if (nd == 'D') ny = y + 1;
                else if (nd == 'L') nx = x -1;
                else if (nd == "R") nx = x + 1;
                // else nx = x;
                if (levels[i][ny][nx] == '' || levels[i][ny][nx].length+7 > npath.length)
                {
                    acts.push([nx,ny,nd, npath])
                    if (levels[i][ny][nx] == '' || levels[i][ny][nx].length>npath.length)
                    {
                        levels[i][ny][nx]=npath

                    }
                }
            }
            i = i + 1;

        }
    
        if (finish == N) return [true,results];

        for (var siir = 0;siir<allacts[0].length;siir++)
        {
            a1 = allacts[0][siir];
            if (robotstate.length>1)
            {
                for (var siir2 = 0;siir2<allacts[1].length;siir2++)
                {
                    a2 = allacts[1][siir2];
                    if (a1[0] == a2[0] && a1[1]==a2[1]) continue;
                    if (robotstate[0][0] == a2[0] && robotstate[0][1]==a2[1] && robotstate[1][0]==a1[0] && robotstate[1][1]==a1[1])
                    {
                        continue
                    }
                    if (robotstate.length>2)
                    {
                        for (var siir3 = 0;siir3<allacts[2].length;siir3++)
                        {
                            a3 = allacts[2][siir3];
                            if ((a1[0]== a3[0] && a1[1]==a3[1])|| (a2[0]==a3[0] && a2[1]==a3[1]) )
                            {
                                continue
                            }
                            newrobotstate=[]
                            newrobotstate.push(a1)
                            newrobotstate.push(a2)
                            newrobotstate.push(a3)
                            stack.push(newrobotstate)
                        }
                    }
                    else{
                        newrobotstate=[]
                        newrobotstate.push(a1)
                        newrobotstate.push(a2)
                        stack.push(newrobotstate)
                    }
                }
            }
            else
            {
                newrobotstate=[]
                newrobotstate.push(a1)
                stack.push(newrobotstate)
            }
        }
    }
    return [false,'']
}

labs = [['UL','UD','U','UD','UD','UR','LURD','LUR'],
['LR','LURD','LR','LUR','LURD','L','UD','DR'],
['LD','UD','R','L','UD','R','LURD','LUR'],
['LUR','LURD','LR','LRD','LURD','L','UD','R'],
['L','UD','','UD','U','R','LURD','LRD'],
['LRD','LURD','LR','LURD','LD','','UD','UR'],
['LU','UD','','UR','LURD','LRD','LURD','LR'],
['LRD','LURD','LD','D','UD','UD','UD','RD']]

stack=[]
N = cntR
robots=[]
ends=[]
results=[]
levels=[]
answer = []
// {x:1323,y:1232,d:"U"}
for (var nn = 0;nn<N;nn++){
    x = robsData[nn].x
    y = robsData[nn].y
    d = robsData[nn].d
    xe =robsData[nn].xe
    ye = robsData[nn].ye
    robots.push([x,y,d,''])
    ends.push([xe,ye])
    results.push('')
    levels.push([])
    for (var row = 0; row < labs.length;row++){
            levels[nn].push([])
            for (var col  = 0;col < labs[row].length;col++){
                levels[nn][row].push('')
            }
    }

}
res = bfs(robots,labs,ends,stack)
if (res[0])
{
    return(res[1])
}
else {
    return("HEELP")
}
}
masda  = [{x:3,y:3,d:'L',xe:4,ye:7},{x:1,y:6,d:"R",xe:3,ye:2},{x:0,y:1,d:"L",xe:1,ye:4}]
mass = mazeR(masda,3)
console.log(mass)
