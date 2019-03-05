// fs = require("fs");
var threshold=50;
function Grayscale(rgb) {
    // m = rgb.match(/^#([0-9a-f]{6})$/i)[1];
    m = rgb;
    // if( m) {
    return (parseInt(m.substr(0,2),16)*0.299 + parseInt(m.substr(2,2),16)*0.587 + parseInt(m.substr(4,2),16)*0.114);
    // }
}
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
            for (i in [-1,0,1]){
                for (j in [-1,0,1]){
                    i = parseInt(i);
                    j = parseInt(j);
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
            if (Math.abs(img[yW][xW]-img[yW2][xW2]>100))
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
        if (distance(harisP[s].x,harisP[s].y,harisP[s+1].x,harisP[s+1].y)<7)
        {
            harPoints.push({x:Math.trunc((harisP[s].x+harisP[s].x)/2),y:Math.trunc((harisP[s].y+harisP[s+1].y)/2)})
            s++;
        }
        else harPoints.push({x:harisP[s].x,y:harisP[s].y})
    }
    harisP = harPoints;
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
                    // var thisEval = (evaluation(harisP[f].x,harisP[f].y,harisP[s].x,harisP[s].y,img) + evaluation(harisP[s].x,harisP[s].y,harisP[t].x,harisP[t].y,img)+evaluation(harisP[t].x, harisP[t].y, harisP[d].x, harisP[d].y, img)+evaluation(harisP[d].x,harisP[d].y,harisP[f].x,harisP[f].y,img))/4
                    var thisEval = (rect_eval(harisP[f],harisP[s],harisP[st],harisP[d],img));
                    if (thisEval>0.7)
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

function loaddata(data){
    data = data.split("\n");
    var dataset = data[0].split(" ");
    cnt_im = parseInt(dataset[0]);
    heigth = parseInt(dataset[1]);
    width = parseInt(dataset[2]);
    images = [];
    j = 1;
    cnt_err = 0;
    for (i = 0;i<cnt_im;i++)
    {
        images.push([]);
        row = 0;
    
        for (h = i * heigth;h<=(i+1)*heigth;h++)
        {
            if (h== 0)
                continue;
            curdata = data[h].trim().split(" ");
            images[i].push([]);
            images[i][row].push([]);
    
            for (w = 0; w < curdata.length-1;w++)
            {
                if (curdata[w].length !=6)
                    cnt_err++;
                images[i][row][w] = Grayscale(curdata[w]);
                
            }
            row=row + 1;
    
        }
        // while (j<(i+1)*heigth)
        // {
        //     images[i].push(data[j].split(" "));
        //     j++;
        // } 
    }
    return {imagecnt:cnt_im, heigth:heigth, width:width, data:images};
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
