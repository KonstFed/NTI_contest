// fs = require("fs");
function ARTag(mas)
{
var threshold=50;
function Grayscale(rgb) {
    // m = rgb.match(/^#([0-9a-f]{6})$/i)[1];
// Временный костыль
    

    r = Math.floor(rgb/(256*256));
    g = Math.floor(rgb%(256*256)/256);
    b = Math.floor((rgb%256)/256)
    // if( m) {
    return (r*0.299 + g*0.587 + b*0.114);
    // }
}
// function Grayscale(rgb) {
//     // m = rgb.match(/^#([0-9a-f]{6})$/i)[1];
//     m = rgb.trim();
//     // if( m) {
//     return (parseInt(m.substr(0,2),16)*0.299 + parseInt(m.substr(2,2),16)*0.587 + parseInt(m.substr(4,2),16)*0.114);
//     // }
// }
function GetW(i,j){
  if (i==j){
      return 0.36;
  }
  else if (Math.abs(i)==Math.abs(j)){
    return 0.04;
  }
  else 
    return 0.12;
}

function HarrisDecrease(newImage)
{
    function widthAlg(row,col,image)
    {
        newImage = image;
        stack = [];
        stack.push({x:col,y:row});
        maxx = col;
        minx = col;
        maxy = row;
        miny = row;
        while(stack.length>0)
        {
            cur = stack.shift();
            
            newImage[cur.y][cur.x]=-3;
            var tmp = [-1,0,1]
            for ( var iz = 0; iz<tmp.length;iz++){
                for (var jz = 0; jz <tmp.length;jz++){
                    i = parseInt(tmp[iz]);
                    j = parseInt(tmp[jz]);
                    if ((cur.y+i>=image.length) || (cur.y+i<0)) continue;

                    if ((cur.x+j >= image[0].length) || (cur.x+j <0)) continue;
 
                    if (newImage[cur.y+i][cur.x+j] ==-2)
                    {
                        if (cur.y+i<miny) miny = cur.y+i;
                        else if (cur.y+i>maxy) maxy = cur.y+i;
                        if (cur.x+j<minx) minx = cur.x+j;
                        else if (cur.x+j>maxx) maxx = cur.x+j
                        stack.push({x:cur.x+j,y:cur.y+i})
                    }
                }
            }
        }
        resx = Math.trunc((minx + maxx)/2);
        resy = Math.trunc((miny + maxy)/2);
        return ({x:resx,y:resy})
    }
    for (row = 0; row < newImage.length; row++)
    {
        for (col = 0; col < newImage[0].length; col++)
        {

            if (newImage[row][col]==-2)
            {
                point = widthAlg(row,col,newImage);
                newImage[point.y][point.x] = -6;
            }
        }
    }
}

function harris(image){
    sobelimg=sobel2(image);
    var width = image[0].length;
    var height = image.length;
    k=0.08;
    har = []
    
    for (var y = 0; y < height; y++) { 
        har.push([]);       
        for (var x = 0; x < width; x++) {
            if(x<2 || x>=width-2 || y<2 || y>=height-2){
                har[y].push(0);
                continue;
            }
                
            A=0;
            B=0;
            C=0;
            R=0;
            for (var i=-1; i<2; i++){
                for(var j=-1; j<2; j++){
                    S=sobelimg[y+j][x+i];
                    A=A+S.X*S.X*GetW(i,j);
                    B=B+S.Y*S.Y*GetW(i,j);
                    C=C+S.X*S.Y*GetW(i,j);
                }
            }
            
            DetM=(A*B-C*C);
            TRaceM=A+B;
            R=DetM - k*(TRaceM*TRaceM)
           
            har[y].push(R);
        }
    }
    return har;
}

function evaluation(x1,y1,x2,y2,img)
{
    height = img.length;
    width = img[0].length;

    xV = x2 - x1;
    yV = y2 - y1;
    dx = x2 - x1;
    dy = y2 - y1;

    lenv = Math.sqrt(xV*xV+yV*yV);
    if (lenv<40) return 0;
    xV = Math.round(xV/lenv*4);
    yV = Math.round(yV/lenv*4);

    yV1 = yV;
    yV = xV;
    xV = - yV1;
    yV2 = - yV;
    xV2 = - xV;

    if (dx>0) sign_x = 1;
    else if (dx<0) sign_x = -1;
    else sign_x = 0;

    if (dy>0) sign_y = 1;
    else if (dy<0) sign_y = -1;
    else sign_y = 0;

    cnt = 0;
    cnt_all = 0;
    if (dx<0) dx = -dx;
    if (dy<0) dy = -dy;

    if (dx>dy)
    {
        pdx = sign_x;
        pdy = 0;
        es = dy;
        el = dx;
    }
    else
    {
        pdx = 0;
        pdy = sign_y;
        es = dx;
        el = dy;
    }

    x = x1
    y = y1
    error = parseInt(el/2);
    t = 0;
    
    xW = x + xV;
    yW = y + yV;
    xW2 = x + xV2;
    yW2 = y + yV2;

    if (xW>= 0 && xW<width && yW>=0 && yW<height && xW2 >= 0 && xW2 <width && yW2 >= 0 && yW2<height && img[yW][xW] > img[yW2][xW2]){
        cnt = cnt + 1;
    }
    cnt_all++;
    while(t<el)
    {
        error = error-es;
        if (error<0)
        {
            error += el
            x += sign_x
            y += sign_y
        }
        else
        {
            x += pdx
            y += pdy
        }
        t += 1
        xW = x + xV
        yW = y + yV
        xW2 = x + xV2
        yW2 = y + yV2
        if (xW>= 0 && xW<width && yW>=0 && yW<height && xW2 >= 0 && xW2 <width && yW2 >= 0 && yW2<height)
        {
            if (Math.abs(img[yW][xW]-img[yW2][xW2]>50))
            {
                cnt++;
            }
        }
        cnt_all++;
    }
    dif = cnt/cnt_all
    return (dif)
}
function rect_eval(p1,p2,p3,p4,img)
{

    cur = (evaluation(p1.x,p1.y,p2.x,p2.y,img)+evaluation(p2.x,p2.y,p3.x,p3.y,img)+evaluation(p3.x,p3.y,p4.x,p4.y,img)+evaluation(p4.x,p4.y,p1.x,p1.y,img))/4;

    return (cur);
}

function isBlackCage(p1,p2,img)
{
    black_bias = 60;
    cnt = 0;
    cntall = 0;

    for (var i = Math.round(p1.y); i<=Math.round(p2.y); i++)
    {
        for (j = Math.round(p1.x); j<Math.round(p2.x); j++)
        {
            if (img[i][j]<black_bias)
            {
                cnt++;
            }
            cntall++;
        }
    }
    if ((cnt/cntall)>0.6) return true; 
    else return false;
}

function artag_matrix(points,img,bias = 6)
{
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
        for (var i = 0; i<matrix.length;i++)
        {
            for (var j = 0;j<matrix.length;j++)
            {
                m1[i][matrix.length-1 - j] = matrix[j][i]
            }
        }
        return (m1);
    }
    // function comparex(personA, personB)
    // {
    //     return personA.x - personB.x;
    // }
    // function comparey(personA, personB)
    // {
    //     return personA.y - personB.y;
    // }
    // points.sort(comparex);
    // dify = Math.abs(points[0].y - points[1].y);
    // points.sort(comparey)
    function sortPo(a,b)
    {
        return a[0] - b[0];
    }
    po = [[points.p1.x+points.p1.y,0],[points.p2.x+points.p2.y,1],[points.p3.x+points.p3.y,2],[points.p4.x+points.p4.y,3]]
    pointse = [points.p1,points.p2,points.p3,points.p4]

    po.sort(sortPo);
    difx = Math.abs(pointse[po[0][1]].x - pointse[po[3][1]].x)/bias;
    dify = Math.abs(pointse[po[0][1]].y - pointse[po[0][1]].x)/bias;
    matrix = []
    r = 0;
    p1x = Math.min(pointse[0].x,pointse[1].x,pointse[2].y,pointse[3].y)
    p3x = Math.max(pointse[0].x,pointse[1].x,pointse[2].y,pointse[3].y);
    p1y = Math.min(pointse[2].y,pointse[3].y,pointse[0].y,pointse[1].y);
    p3y = Math.max(pointse[2].y,pointse[3].y,pointse[0].x,pointse[1].x);
    difx = Math.abs(p1x - p3x) / bias;
    dify = Math.abs(p1y - p3y) / bias;

    for (var row = dify+p1y;row<=p3y-dify-4;row += dify)
    {
        matrix.push([])
        for (var col = difx + p1y; col <= p3y- difx-4; col += difx)
        {
            if (isBlackCage({x:col-difx,y:row-dify},{x:col,y:row},img))
            {
                matrix[r].push(1);
            }
            else{
                matrix[r].push(0);
            }
        }
        r++;
    }
    flags = false
    for (c = 0; c<4;c++)
    {
        if (matrix[bias-3][bias-3]==0){
            flags = true
            break;
        }
        else{
            matrix = rotateMatrix(matrix);
        }
    }
    if (flags)
    {
        answ = [];
        for (var j = 0;j<matrix.length;j++)
        {
            for (var i = 0; i<matrix.length;i++)
            {
                if ((j == 0 && i == 0) || (j == 0 && i == matrix.length-1) ||(j == matrix.length-1 && i == 0) || (j == matrix.length-1 && i == matrix.length-1))
                {
                    continue;
                }
                else{
                    answ.push(matrix[j][i]);
                }
            }
        }
        var n = answ[2]+""+answ[4];
        var x = answ[5] + "" + answ[6] + "" + answ[8];
        var y = answ[9] + "" + answ[10] + "" + answ[11];

    
        return {n:parseInt(n,2),x:parseInt(x,2),y:parseInt(y,2)};
    }
    else
    {
        return {n:-1,x:-1,y:-1};
    }

}

function distance(x1,y1,x2,y2)
{
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}
function findBorders(harisP,img)
{
    function comparex(personA, personB)
    {
        return personA.x - personB.x;
    }
    borders = [];
    best = {p:{},l:0};
    harisP.sort(comparex);
    harPoints = []
    for (var s = 0; s < harisP.length-1;s++)
    {
        for (var gf = s; gf<harisP.length;gf++)
        {
            if (distance(harisP[s].x,harisP[s].y,harisP[s+1].x,harisP[s+1].y)<5)
            {
                // harPoints.push({x:Math.trunc((harisP[s].x+harisP[s].x)/2),y:Math.trunc((harisP[s].y+harisP[s+1].y)/2)})
                harisP.splice(s,2,{x:Math.trunc((harisP[s].x+harisP[s].x)/2),y:Math.trunc((harisP[s].y+harisP[s+1].y)/2)})
                s++;
            }
            // else harPoints.push({x:harisP[s].x,y:harisP[s].y})
        }
    }
    // harisP = harPoints.sort; 
    for (f = 0; f <harisP.length; f++)
    {
        for (s = 0; s < harisP.length;s++)
        {
            for (st = 0;st<harisP.length;st++)
            {
                for (d = 0;d<harisP.length;d++)
                {
                    if (f==s || f == st || f == d || s == st || s == d || st == d )
                    {
                        continue;
                    }
                    // if (harisP[f].x)
                    // var thisEval = (evaluation(harisP[f].x,harisP[f].y,harisP[s].x,harisP[s].y,img) + evaluation(harisP[s].x,harisP[s].y,harisP[t].x,harisP[t].y,img)+evaluation(harisP[t].x, harisP[t].y, harisP[d].x, harisP[d].y, img)+evaluation(harisP[d].x,harisP[d].y,harisP[f].x,harisP[f].y,img))/4
                    var thisEval = (rect_eval(harisP[f],harisP[s],harisP[st],harisP[d],img));
                    if (thisEval>=0.1)
                    {
                        ln = distance(harisP[f].x,harisP[f].y,harisP[s].x,harisP[s].y) + distance(harisP[f].x,harisP[f].y,harisP[d].x,harisP[d].y) + distance(harisP[s].x,harisP[s].y,harisP[st].x,harisP[st].y) + distance(harisP[st].x,harisP[st].y,harisP[d].x,harisP[d].y);
                        if (ln>best.l)
                        {
                            best.l = ln;
                            best.p = {p1:{x:harisP[f].x,y:harisP[f].y,},p2:{x:harisP[s].x,y:harisP[s].y},p3:{x:harisP[st].x,y:harisP[st].y},p4:{x:harisP[d].x,y:harisP[d].y}}
                        }
                    }
                }
            }
        
        }
    }
    return (best.p);
    
}

function testmask(image, cx,cy, mask){
    var allsum=0;
    for (y = 0; y < 3; y++) {             
        for (x = 0; x < 3; x++) {
            allsum+=image[cx+(y-1)*2][cx+(x-1)*2]*mask[y][x];
        }
    }
    return allsum;
}
function searchcorners(image){
    var width = image[0].length;
    var height = image.length;
    var rad=6
    points=[];
    var c1 = [
        [1,1,1],
        [1,0,0],
        [1,0,0]
      ];
      var c2 = [
        [1,0,0],
        [1,0,0],
        [1,1,1]
      ];
      var c3 = [
        [0,0,1],
        [0,0,1],
        [1,1,1]
      ];
      var c4 = [
        [1,1,1],
        [0,0,1],
        [0,0,1]
      ];
      var c5 = [
        [1,1,1],
        [1,0,1],
        [0,0,0]
      ]; 
      var c6 = [
        [0,0,0],
        [1,0,1],
        [1,1,1]
      ];
      var c7 = [
        [0,1,1],
        [0,0,1],
        [0,1,1]
      ];
      var c8= [
        [1,1,0],
        [1,0,0],
        [1,1,0]
      ];
    for (var y = 2; y < height-2; y++) {             
        for (var x = 2; x < width-1; x++) {
            if(image[y][x]==-1){
                if(testmask(image,x,y,c1)==0){
                    image[y][x]=-2;
                    break;
                }
                if(testmask(image,x,y,c2)==0){
                    image[y][x]=-2;
                    break;
                }
                if(testmask(image,x,y,c3)==0){
                    image[y][x]=-2;
                    break;
                }
                if(testmask(image,x,y,c4)==0){
                    image[y][x]=-2;
                    break;
                }
                if(testmask(image,x,y,c5)==0){
                    image[y][x]=-2;
                    break;
                }
                if(testmask(image,x,y,c6)==0){
                    image[y][x]=-2;
                    break;
                }
                if(testmask(image,x,y,c7)==0){
                    image[y][x]=-2;
                    break;
                }
                if(testmask(image,x,y,c8)==0){
                    image[y][x]=-2;
                    break;
                }
            }
        }
    }
}


function trace(image,x,y)
{
    var height=image.length;
    var width=image[0].length
    stack = []
    prevx = x;
    prevy = y;
    points=[];
    points.push({x:x,y:y})
    first=points[0]; 
    found=true;
    maxdist = 0;
    maxp = first;
    stack.push(first);
    while (stack.length>0)
    {
        found=false;
        curp = stack[0];
        stack.splice(0,1);
        for (i = curp.y -1;i<=curp.y+1;i++)
        {
            if( i<0 || i>=height)
                    continue;
            for (j = curp.x - 1;j<=curp.x+1;j++)
            {
                if((i==curp.y && j==curp.x) || j<0 || j>=width)
                    continue;
                if (image[i][j] > threshold /*&& dist(j,i,first.x,first.y)>=maxdist*/)
                {
                    last={x:j,y:i}; 
                    image[i][j]=-1;
                    deleted=false;
                    // for (c = 1;c<points.length;c++){
                    //     if(dist_to_line(first.x, first.y, last.x, last.y, points[c].x,points[c].y)>1){
                    //         stack.splice(i,1);
                    //         deleted=true;
                    //         break;
                    //         // return {p1:first, p2: points[points.length-1]};
                    //     }
                    // }
                    if(!deleted);{
                        stack.push(last);
                    // if( dist(j,i,first.x,first.y)>=maxdist ){
                        maxdist = dist(j,i,first.x,first.y);
                        maxp=last;
                    }
                    // }
                
                    
                    
                }
            }
            // if(found)
            //     break;
        }
        for(i=stack.length-1;i>=0; i--){
            deleted=false;
            // for (c = 1;c<points.length;c++){
            //     if(dist_to_line(first.x, first.y, stack[i].x, stack[i].y, points[c].x,points[c].y)>1){
            //         stack.splice(i,1);
            //         deleted=true;
            //         break;
            //         // return {p1:first, p2: points[points.length-1]};
            //     }
            // }
            // if (!deleted)
                points.push(stack[i])
        }
    }
    if(points.length>5)
        return {p1:first, p2: points[points.length-1]};
    else
        return null;
}

function seekline(image,x,y){
    res=trace(image,x,y);
    if(res!=null){
        res2=trace(image,x,y);
        if (res2==null)
            return res;
    }
    else
        return null;
        
    return {p1:res.p2, p2:res2.p2};
        
}

function seeklines(image){
    var width = image[0].length;
    var height = image.length;
    for (y = 0; y < height; y++) {        
        for (x = 0; x < width; x++) {
            if (image[y][x]>20){
                trace(image,x,y)
            }
        }
    }
}

// var  data = fs.readFileSync("test1.txt","utf8");
function sobel(image)
{
    var width = image[0].length;
    var height = image.length;

    var kernelX = [
      [-1,0,1],
      [-2,0,2],
      [-1,0,1]
    ];

    var kernelY = [
      [-1,-2,-1],
      [0,0,0],
      [1,2,1]
    ];
    function pixelAt(col,row)
    {
        if ((col<0) || (col>=width) || (row<0) || (row>=height))
        {
            return 0;
        }
        return image[row][col];
    }
    gradient = []
    for (y = 0; y < height; y++) {
        gradient.push([])
        for (x = 0; x < width; x++) {
            var pixelX = (
                (kernelX[0][0] * pixelAt(x - 1, y - 1)) +
                (kernelX[0][1] * pixelAt(x, y - 1)) +
                (kernelX[0][2] * pixelAt(x + 1, y - 1)) +
                (kernelX[1][0] * pixelAt(x - 1, y)) +
                (kernelX[1][1] * pixelAt(x, y)) +
                (kernelX[1][2] * pixelAt(x + 1, y)) +
                (kernelX[2][0] * pixelAt(x - 1, y + 1)) +
                (kernelX[2][1] * pixelAt(x, y + 1)) +
                (kernelX[2][2] * pixelAt(x + 1, y + 1))
            );
    
            var pixelY = (
                (kernelY[0][0] * pixelAt(x - 1, y - 1)) +
                (kernelY[0][1] * pixelAt(x, y - 1)) +
                (kernelY[0][2] * pixelAt(x + 1, y - 1)) +
                (kernelY[1][0] * pixelAt(x - 1, y)) +
                (kernelY[1][1] * pixelAt(x, y)) +
                (kernelY[1][2] * pixelAt(x + 1, y)) +
                (kernelY[2][0] * pixelAt(x - 1, y + 1)) +
                (kernelY[2][1] * pixelAt(x, y + 1)) +
                (kernelY[2][2] * pixelAt(x + 1, y + 1))
            );
    
            var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY))>>>0;
            gradient[y].push(magnitude);
            // sobelData.push(magnitude, magnitude, magnitude, 255);
        }
    }
    return gradient
}

function sobel2(image)
{
    var width = image[0].length;
    var height = image.length;

    var kernelX = [
      [-1,0,1],
      [-2,0,2],
      [-1,0,1]
    ];

    var kernelY = [
      [-1,-2,-1],
      [0,0,0],
      [1,2,1]
    ];
    function pixelAt(col,row)
    {
        if ((col<0) || (col>=width) || (row<0) || (row>=height))
        {
            return 0;
        }
        return image[row][col];
    }
    gradient = []
    for (y = 0; y < height; y++) {
        gradient.push([])
        for (x = 0; x < width; x++) {
            // непонятный баг: не идет по циклу а просто увеличивает итератор
            var pixelX = (
                (kernelX[0][0] * pixelAt(x - 1, y - 1)) +
                (kernelX[0][1] * pixelAt(x, y - 1)) +
                (kernelX[0][2] * pixelAt(x + 1, y - 1)) +
                (kernelX[1][0] * pixelAt(x - 1, y)) +
                (kernelX[1][1] * pixelAt(x, y)) +
                (kernelX[1][2] * pixelAt(x + 1, y)) +
                (kernelX[2][0] * pixelAt(x - 1, y + 1)) +
                (kernelX[2][1] * pixelAt(x, y + 1)) +
                (kernelX[2][2] * pixelAt(x + 1, y + 1))
            );
    
            var pixelY = (
                (kernelY[0][0] * pixelAt(x - 1, y - 1)) +
                (kernelY[0][1] * pixelAt(x, y - 1)) +
                (kernelY[0][2] * pixelAt(x + 1, y - 1)) +
                (kernelY[1][0] * pixelAt(x - 1, y)) +
                (kernelY[1][1] * pixelAt(x, y)) +
                (kernelY[1][2] * pixelAt(x + 1, y)) +
                (kernelY[2][0] * pixelAt(x - 1, y + 1)) +
                (kernelY[2][1] * pixelAt(x, y + 1)) +
                (kernelY[2][2] * pixelAt(x + 1, y + 1))
            );
    
            var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY))>>>0;
            gradient[y].push({X:pixelX, Y:pixelY});
            // sobelData.push(magnitude, magnitude, magnitude, 255);
        }
    }
    return gradient
}
function gauss_filter(image)
{
    function sumOfMatrix(m)
    {
        var sum = 0;
        for (var row = 0; row < m.length;row++)
        {
            for (col  = 0;col<m[0].length;col++){
                sum = sum + m[row][col]
            }
        }
        return sum;
    }
    function mult_ma(m1,m2)
    {
        m3 = [[0,0,0],[0,0,0],[0,0,0]]
        for (var row = 0;row<m1.length;row++)
        {
            for (var col = 0;col<m1[0].length;col++)
            {
                m3[row][col] = m1[row][col] * m2[row][col]
            }
        }
        return m3
    }
    newImg = image;
    coef = [[1,2,1],[2,4,2],[1,2,1]]
    for (var j = 1; j<image.length-1;j++)
    {
        for (var i = 1; i < image[0].length-1;i++)
        {
            matrix = [ [image[j-1][i-1],image[j-1][i],image[j-1][i+1]], [image[j][i-1],image[j][i],image[j][i+1]],[image[j+1][i-1],image[j+1][i],image[j+1][i+1]]]
            var cur = mult_ma(coef,matrix);
            newImg[j][i] = sumOfMatrix(cur)/16;
        }
    }
    return newImg;
}
function loaddata(data){
    // data = data.split("\n");
    // var dataset = data[0].split(" ");
    cnt_im = 1;
    heigth = 120;
    width = 160;
    images = [];
    j = 1;
    cnt_err = 0;
    for (i = 0;i<cnt_im;i++)
    {
        images.push([]);
        // row = 0;
    
        for (h = 0;h<heigth;h++)
        {
            // curdata = data[h].trim().split(" ");
            images[i].push([]);
            images[i][h].push([]);
    
            for (w = 0; w < width ;w++)
            {
                // if (data[h*width+w]== undefined)
                // {
                //     console.log("help")
                // }
                images[i][h][w] = Grayscale(data[h*width+w]);
                // if (images[i][h][w] == NaN)
                // {
                //     console.log("ds")
                // }
                
            }
    
        }
        // while (j<(i+1)*heigth)
        // {
        //     images[i].push(data[j].split(" "));
        //     j++;
        // } 
    }
    img =images[0]
    img = gauss_filter(img);
    return {imagecnt:cnt_im, heigth:heigth, width:width, data:img};
}



function erase(image){
    var width = image[0].length;
    var height = image.length;
    for (y = 0; y < height; y++) {   
             
        for (x = 0; x < width; x++) {
            if( y<1 || y>=height-1 || x<1 || x>=width-1){
                image[y][x]=0;
                continue;
            }
                    
            cnt=0;
            if(image[y][x+1]>threshold)
                cnt++;
            if(image[y][x-1]>threshold)
                cnt++;
            if(image[y-1][x]>threshold)
                cnt++;
            if(image[y+1][x]>threshold)
                cnt++;
            if(cnt>2)
                image[y][x]=0;
        }
    }
}
function indeficate(image)
{

}
// if (images.length>0){
//    console.log(cnt_err);
// }
// else{
//     console.log("fail");
// }
function harristest(image){
    var h=harris(image);
    newImg = image;
    var height=h.length;
    var cnt = 0;
    var width=h[0].length
        for (row = 0;row<height;row++)
        {
            for (col = 0;col<width;col++)
            {
                if(h[row][col]>harrisPoint){
                    // ctx.fillStyle = "rgba(0,0,255,1)";
                    // ctx.fillRect( col, row, 1, 1 );
                    newImg[row][col] = -2;
                    cnt++;
                };
            }
        }
        // console.log(cnt)
        cnt = 0;
        HarrisDecrease(newImg);
        for (row = 0;row<height;row++)
        {
            for (col = 0;col<width;col++)
            {
                if(newImg[row][col] == -6){
                    borderPoints.push({x:col,y:row});
                    // ctx.fillStyle = "rgba(0,0,255,1)";
                    // ctx.fillRect( col, row, 1, 1 );
                    cnt++;
                };
            }
        } 
        // console.log(cnt)
        return borderPoints;   
    }





// function onMouseClick(e) {

//     var c = document.getElementById("canvas");
    
//     var height=newImage.length;
//     var width=newImage[0].length
//     var clickX;
//     var clickY;
//     if (e.pageX || e.pageY) { 
//         clickX = e.pageX;
//         clickY = e.pageY;
//     }
//     else { 
//         clickX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
//         clickY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
//     } 
//     clickX -= c.offsetLeft;
//     clickY -= c.offsetTop;
//     x = clickX;
//     y = clickY;
//     if(newImage && y<newImage.length && x<newImage[0].length && newImage[y][x]>20)
//         {
        
//         var ctx = c.getContext("2d");       
//         var line=seekline(newImage, x, y);
//         searchcorners(newImage)
//         var canvas = document.getElementById('canvas');
//         canvas.width=width;
//         canvas.height=height;
//         if (canvas.getContext) {
//             var ctx = canvas.getContext('2d');
//             for (row = 0;row<height;row++)
//             {
//                 for (col = 0;col<width;col++)
//                 {
//                     if(newImage[row][col]==-1){
//                         ctx.fillStyle = "rgba(255,0,0,1)";
//                         ctx.fillRect( col, row, 1, 1 );
//                     };
//                     if(newImage[row][col]==-2){
//                         ctx.fillStyle = "rgba(0,255,0,1)";
//                         ctx.fillRect( col, row, 1, 1 );
//                     };
                    
//                 }
//             }

    
//         }
//         // ctx.beginPath();
//         // ctx.lineWidth = 5;
//         // ctx.strokeStyle = '#FF0000';
//         // ctx.moveTo(line.p1.x, line.p1.y);
//         // ctx.lineTo(line.p2.x, line.p2.y);
//         // ctx.stroke();
//         }
    
// }

function erasesobel()
{
    erase(newImage);
    draw(images.width, images.heigth, newImage);
}
// function init(){
//     document.addEventListener("click", onMouseClick, false);
//     document.addEventListener('mousemove', function(e) {
//         var c = document.getElementById("canvas");
//             var clickX;
//             var clickY;
//             if (e.pageX || e.pageY) { 
//                 clickX = e.pageX;
//                 clickY = e.pageY;
//             }
//             else { 
//                 clickX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
//                 clickY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
//             } 
//             clickX -= c.offsetLeft;
//             clickY -= c.offsetTop;
//             x = clickX;
//             y = clickY;
//             // if(newImage && e.clientY<newImage.length && e.clientX<newImage[0].length  newImage[y][x]>20)
//             // {
//             console.log(x,y)
//       });
    
    

// }



// function draw(width, height, data) {
//     var canvas = document.getElementById('canvas');
//     canvas.width=width;
//     canvas.height=height;
//     if (canvas.getContext) {
//         var ctx = canvas.getContext('2d');
//         for (row = 0;row<height;row++)
//         {
//             for (col = 0;col<width;col++)
//             {
//                 c = data[row][col];
//                 ctx.fillStyle = "rgba("+c+","+c+","+c+","+1+")";
//                 ctx.fillRect( col, row, 1, 1 );
//             }
//         }

//     // ctx.fillRect(25,25,100,100);
//     // ctx.clearRect(45,45,60,60);
//     // ctx.strokeRect(50,50,50,50);
//   }
// }
var bestb = [];
var borderPoints = [];
var images;
var newImage;
var harrisPoint = 100000000;
function sobel_test()
{
    newImage = sobel(images.data[0]);
    // draw(images.width, images.heigth, newImage);
}
function test(text){

    // var txtaarea = document.getElementById('txtdata');
    images=loaddata(text).data;
    // draw(images.width, images.heigth, images.data[0]);
    // sobel_test();
    return images
}
function border(img,bordp)
{
    bestb = findBorders(bordp,img);
    // var canvas = document.getElementById("canvas");
    // if (canvas.getContext) {
    //     var ctx = canvas.getContext('2d');

    //     ctx.strokeStyle = "red";
        // ctx.moveTo(bestb.p1.x, bestb.p1.y)
        // ctx.lineTo(bestb.p2.x,bestb.p2.y)
        // ctx.lineTo(bestb.p4.x,bestb.p4.y)
        // ctx.moveTo(bestb.p2.x, bestb.p2.y)
        // ctx.lineTo(bestb.p3.x,bestb.p3.y)
        // ctx.moveTo(bestb.p3.x, bestb.p3.y)
        // ctx.lineTo(bestb.p4.x,bestb.p4.y)
        // ctx.beginPath();
        // ctx.moveTo(0, 0);
        // ctx.lineTo(100, 100);  
        // ctx.stroke()
        // if (bestb.length <4){
        //     console.log("Убе");
        // }
        // ctx.beginPath();
        // ctx.moveTo(bestb.p1.x, bestb.p1.y);
        // ctx.lineTo(bestb.p2.x, bestb.p2.y);  
        // ctx.stroke();
        // ctx.beginPath();
        // ctx.moveTo(bestb.p2.x, bestb.p2.y);
        // ctx.lineTo(bestb.p3.x, bestb.p3.y);  
        // ctx.stroke();       
        // ctx.beginPath();
        // ctx.moveTo(bestb.p3.x, bestb.p3.y);
        // ctx.lineTo(bestb.p4.x, bestb.p4.y);  
        // ctx.stroke();        
        // ctx.beginPath();
        // ctx.moveTo(bestb.p4.x, bestb.p4.y);
        // ctx.lineTo(bestb.p1.x, bestb.p1.y);  
        // ctx.stroke();
        // ctx.fillRect( bestb.p1.y, bestb.p1.x, 1, 1 );
        // ctx.fillRect( bestb.p2.y, bestb.p2.x, 1, 1 );
        // ctx.fillRect( bestb.p3.y, bestb.p3.x, 1, 1 );
        // ctx.fillRect( bestb.p4.y, bestb.p4.x, 1, 1 );

    
}

function isBlackCage(p1,p2,img)
{
    black_bias = 60;
    cnt = 0;
    cntall = 0;

    for (var i = Math.round(p1.y); i<=Math.round(p2.y); i++)
    {
        for (j = Math.round(p1.x); j<Math.round(p2.x); j++)
        {
            if (img[i][j]<black_bias)
            {
                cnt++;
            }
            cntall++;
        }
    }
    if ((cnt/cntall)>0.6) return true; 
    else return false;
}
function count_artag()
{
    res = artag_matrix(bestb,images);
    return res
}


var threshold= 20; // надо настроить

function TransMatrix(A)       //На входе двумерный массив
{
    var m = A.length, n = A[0].length, AT = [];
    for (var i = 0; i < n; i++)
    { 
        AT[ i ] = [];
        for (var j = 0; j < m; j++) 
            AT[ i ][j] = A[j][ i ];
    }
    return AT;
}
function SumMatrix(A,B)       //На входе двумерные массивы одинаковой размерности
{   
    var m = A.length, n = A[0].length, C = [];
    for (var i = 0; i < m; i++)
    { 
        C[ i ] = [];
        for (var j = 0; j < n; j++)
            C[ i ][j] = A[ i ][j]+B[ i ][j];
    }
    return C;
}
function linedist(px,py,ax,ay,bx,by){
    
    s=Math.abs(ax*(by-py)+bx*(py-ay)+px*(ay-by))/2;
    d=2*s/Math.sqrt((ax-bx)*(ax-bx)+(ay-by)*(ay-by));
    return d;
}

function dist_to_line(x1,y1,x2,y2,x3,y3)
{
    osn = Math.sqrt((x3-x2)*(x3-x2) + (y3-y2)*(y3-y2))
    return Math.abs(((x3-x2)*(y1 - y2)- (y3-y2)*(x1-x2))/osn)
}

function dist(x1,y1,x2,y2)
{
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

function multMatrixNumber(a,A)  // a - число, A - матрица (двумерный массив)
{   
    var m = A.length, n = A[0].length, B = [];
    for (var i = 0; i < m; i++)
    { 
        B[ i ] = [];
        for (var j = 0; j < n; j++) 
            B[ i ][j] = a*A[ i ][j];
    }
    return B;
}

function MultiplyMatrix(A,B)
{
    var rowsA = A.length, colsA = A[0].length,
    rowsB = B.length, colsB = B[0].length,
    C = [];
    if (colsA != rowsB) return false;
    for (var i = 0; i < rowsA; i++) C[ i ] = [];
    for (var k = 0; k < colsB; k++)
    { 
        for (var i = 0; i < rowsA; i++)
        { 
            var t = 0;
            for (var j = 0; j < rowsB; j++) 
                t += A[ i ][j]*B[j][k];
            C[ i ][k] = t;
        }
    }
    return C;
}
// var fileContent = fs.readFileSync("Output2.txt", "utf8");
image = test(mas);
tmp = image;

p = harristest(tmp);
var borderP = border(image,p);
res = count_artag();
return res;
}
heigth = 120;
width = 160;
fs = require("fs");
// var CameraPhone = fs.readFileSync("Output.txt", "utf8").trim();
// var fileContent = fs.readFileSync("Lenin.txt", "utf8");
var data = fs.readFileSync("xleb.txt", "utf8").trim();
data = data.split(",");
// data.shift();

console.log(ARTag(data))
    // Get the datma-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    