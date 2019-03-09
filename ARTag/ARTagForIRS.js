function ARTag(data,heigth=160,width=120)
{
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
                var pixelX = ( (kernelX[0][0] * pixelAt(x - 1, y - 1,image)) + (kernelX[0][1] * pixelAt(x, y - 1,image)) +(kernelX[0][2] * pixelAt(x + 1, y - 1,image)) +(kernelX[1][0] * pixelAt(x - 1, y,image)) +(kernelX[1][1] * pixelAt(x, y,image)) +(kernelX[1][2] * pixelAt(x + 1, y,image)) +
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
    function loaddata(data){
        function Grayscale(rgb) {
            // m = rgb.match(/^#([0-9a-f]{6})$/i)[1];
            m = rgb;
            // if( m) {
            return (parseInt(m.substr(0,2),16)*0.299 + parseInt(m.substr(2,2),16)*0.587 + parseInt(m.substr(4,2),16)*0.114);
            // }
        }
        data = data.split("\n");
        var dataset = data[0].split(" ");
        cnt_im = parseInt(dataset[0]);
        heigth = parseInt(dataset[1]);
        width = parseInt(dataset[2]);
        images = [];
        j = 1;
        cnt_err = 0;

        row = 0;
    
        for (h = 1;h<=heigth;h++)
        {
            curdata = data[h].trim().split(" ");
            images.push([]);
    
            for (w = 0; w < curdata.length-1;w++)
            {
                images[row][w] = Grayscale(curdata[w]);
            }
        
            // while (j<(i+1)*heigth)
            // {
            //     images[i].push(data[j].split(" "));
            //     j++;
            // } 
        }
        return {imagecnt:cnt_im, heigth:heigth, width:width, data:images};
    }
    function harris(image){
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
        var width = image[0].length;
        var height = image.length;
        sobelimg=sobel2(image,height,width);

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
    
    function harristest(images){
        borderPoints = []
        harrisPoint = 100000000;
        var h=harris(images.data);
        newImg = images.data;
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
    function border(img)
    {
        bestb = findBorders(borderPoints,img);

        
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
        return (best.p);
        
    }
    function distance(x1,y1,x2,y2)
    {
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
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

        
            return({n:parseInt(n1,2),x: parseInt(x,2),y:parseInt(y,2)})
        }
        else
        {
            return {n:-1,x:-1,y:-1};
        }

    }
    fs = require("fs");
    var fileContent = fs.readFileSync("Output2.txt", "utf8");
    images=loaddata(fileContent);
    borderP = harristest(images);
    bestp = findBorders(borderP,images.data);
    answ = artag_matrix(bestp,images.data);
    console.log(best.p1.x,best.p1.y + " "+best.p2.x,best.p2.y +" " +best.p3.x,best.p3.y + " " +best.p4.x,best.p4.y)
    console.log(answ.n+" "+answ.x+" "+answ.y);
}
ARTag()