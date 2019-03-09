function detect_ARTag(img,height = 160,width = 120)
{
    fs = require("fs")
    image = [];
    for (var row = 0;row<height;row++)
    {
        image.push([]);
        for (var col = 0; col<width; col++)
        {
            var cur = img[row*width+col];
            r1 = Math.trunc(cur /(256*256));
            g1 = Math.trunc((cur %256)/256);
            b1 = cur % 256
            image[row].push({r:r1,g:g1,b:b1});
        }
    }
    // newImages = image;
    // // fs.writeFileSync("test_data.txt", "");
    // for (var row = 0; row<height;row++)
    // {
    //     if (row == 0 || row == height-1) continue;
    //     for (var col = 0; col < width; col++)
    //     {
    //         if (col==0 || col == width-1) continue;
    //         var means = []
    //         var r = 0;
            // for (var j = row-1;j<=row+1;j++)
            // {
            //     for(var i = col - 1;i<=col+1;i++)
            //     {
            //         means.push(image[j][i]);
            //     }
            // }
            // means.sort();
            // newImages[row][col] = means[5];

    //     }
    // }
    // for (var row = 0; row<height;row++)
    // {
    //     var s = "";
    //     for (var col = 0; col<width;col++)
    //     {
    //         a = [image[row][col].r,image[row][col].g,image[row][col].b]
    //         var b = a.map(function(x){             //For each array element
    //             x = parseInt(x).toString(16);      //Convert to a base16 string
    //             return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
    //         })
    //         s = s + " " + b.join("") ;
    //     }
    //     s = s + "\n";
    //     fs.appendFileSync("test_data.txt", s);

    // }
    return ARTag(image,height,width)
}
function ARTag(image,height = 160,width = 120)
{
    function Grayscale(rgb) {
        return (rgb.r*0.299 + rgb.g*0.587 + rgb.b*0.114);
    }
    function loaddata(data,heigth,width){
        image = [];
        for (h = 0;h<heigth;h++)
        {
            image.push([]);
            image[h].push([]);
    
            for (w = 0; w < width;w++)
            {
                image[h][w] = Grayscale(data[h][w]);
            }
        }
        return {heigth:heigth, width:width, data:image};
    }
    function sobel2(image,height = 160,width = 120)
{
    // var width = image[0].length;
    // var height = image.length;

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
    function pixelAt(col,row,image)
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
                (kernelX[0][0] * pixelAt(x - 1, y - 1,image)) +
                (kernelX[0][1] * pixelAt(x, y - 1,image)) +
                (kernelX[0][2] * pixelAt(x + 1, y - 1,image)) +
                (kernelX[1][0] * pixelAt(x - 1, y,image)) +
                (kernelX[1][1] * pixelAt(x, y,image)) +
                (kernelX[1][2] * pixelAt(x + 1, y,image)) +
                (kernelX[2][0] * pixelAt(x - 1, y + 1,image)) +
                (kernelX[2][1] * pixelAt(x, y + 1,image)) +
                (kernelX[2][2] * pixelAt(x + 1, y + 1,image))
            );
    
            var pixelY = (
                (kernelY[0][0] * pixelAt(x - 1, y - 1,image)) +
                (kernelY[0][1] * pixelAt(x, y - 1,image)) +
                (kernelY[0][2] * pixelAt(x + 1, y - 1,image)) +
                (kernelY[1][0] * pixelAt(x - 1, y,image)) +
                (kernelY[1][1] * pixelAt(x, y,image)) +
                (kernelY[1][2] * pixelAt(x + 1, y,image)) +
                (kernelY[2][0] * pixelAt(x - 1, y + 1,image)) +
                (kernelY[2][1] * pixelAt(x, y + 1,image)) +
                (kernelY[2][2] * pixelAt(x + 1, y + 1,image))
            );
    
            var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY))>>>0;
            gradient[y].push({X:pixelX, Y:pixelY});
            // sobelData.push(magnitude, magnitude, magnitude, 255);
        }
    }
    return gradient
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
    function harris(image,height,width){
        sobelimg=sobel2(image,height,width);
        // var width = image[0].length;
        // var height = image.length;
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
    function harristest(image,height,width){
        harrisPoint = 1000000000;
        var h=harris(image,height,width)
        newImg = image
        var height=h.length;
        var width=h[0].length
        for (row = 0;row<height;row++)
        {
            for (col = 0;col<width;col++)
            {
                if(h[row][col]>harrisPoint){
                    newImg[row][col] = -2;
                };
            }
        }
        borderPoints = []
        HarrisDecrease(newImg);
        for (row = 0;row<height;row++)
        {
            for (col = 0;col<width;col++)
            {
                if(newImg[row][col] == -6){
                    borderPoints.push({x:col,y:row});
                };
            }
        }    
        
        return borderPoints;
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
        if (distance(harisP[s].x,harisP[s].y,harisP[s+1].x,harisP[s+1].y)<5)
        {
            harPoints.push({x:Math.trunc((harisP[s].x+harisP[s].x)/2),y:Math.trunc((harisP[s].y+harisP[s+1].y)/2)})
            s++;
        }
        else harPoints.push({x:harisP[s].x,y:harisP[s].y})
    }
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
                    var thisEval = (rect_eval(harisP[f],harisP[s],harisP[st],harisP[d],img));
                    if (thisEval>0.5)
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
    if (best.l == 0) return ([false,{}])
    return ([true,best.p]);
    
}
    function border(img,borderPoints)
    {
        bestb = findBorders(borderPoints,img);
        if (bestb[0]) return [true,bestb[1]];
        else
        {
            return [false,{}];
         
        }
        
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
        difx = Math.abs(points.p3.x - points.p1.x)/bias;
        dify = Math.abs(points.p3.y - points.p1.y)/bias;
        matrix = []
        r = 0;
        p1x = Math.min(points.p1.x,points.p3.x);
        p3x = Math.max(points.p1.x,points.p3.x);
        p1y = Math.min(points.p1.y,points.p3.y);
        p3y = Math.max(points.p1.y,points.p3.y);

        for (var row = dify*2+p1y;row<=p3y-dify;row += dify)
        {
            matrix.push([])
            for (var col = difx*2 + p1x; col <=  p3x-difx; col += difx)
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
            var n1 = answ[2]+""+answ[4];
            var x1 = answ[5] + "" + answ[6] + "" + answ[8];
            var y1 = answ[9] + "" + answ[10] + "" + answ[11];    
            return ({n:parseInt(n1,2),x:parseInt(x1,2),y:parseInt(y1,2)})
        }
        else
        {
            return {n:-1,x:-1,y:-1};
        }

    }   

    data= loaddata(image,height,width);
    console.log(data.data);
    // var h = harris(data.data);
    tmp = data.data
    borderPoints =  harristest(tmp,height,width);
    bestb = border(data.data,borderPoints);
    if (bestb[0])
    {
        answ = artag_matrix(bestb[1],data.data);
        return answ;
    }
    else
    {
        return {n:-1,x:-1,y:-1};
    }
}
fs = require("fs")

var fileContent = fs.readFileSync("xleb.txt", "utf8");
imag = fileContent.split(",")
// for (var i = 0; i < 117;i++)
// {
//     im.push(imag[i].trim().split(" "))
// }
ar = detect_ARTag(imag,160,120)

console.log("n:" + ar.n+' x:'+ar.x + " y:"+ ar.y)