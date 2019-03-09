function readTrik(data)
{
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
    function getRgb(trik) {
        // m = rgb.match(/^#([0-9a-f]{6})$/i)[1];
        // Временный костыль
    

        r = Math.floor(trik/(256*256));
        g = Math.floor(trik%(256*256)/256);
        b = Math.floor((trik%256)/256)
        // if( m) {
        a  = [r,g,b]
        var b = a.map(function(x){             //For each array element
            x = parseInt(x).toString(16);      //Convert to a base16 string
            return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
        })
        return (b.join(""));
        // }

    }
    function Grayscale(rgb) {
        // m = rgb.match(/^#([0-9a-f]{6})$/i)[1];
        m = rgb.trim();
        // if( m) {
        return (parseInt(m.substr(0,2),16)*0.299 + parseInt(m.substr(2,2),16)*0.587 + parseInt(m.substr(4,2),16)*0.114);
        // }
    }
    heigth = 120;
    width = 160;
    img = []
    dimg = []
    for (var row = 0; row<heigth;row++)
    {
        img.push([])
        dimg.push([])
        for (var col = 0;col<width;col++)
        {

            img[row][col] = getRgb(data[row*width+col]).toUpperCase();
   
            dimg[row][col] = Grayscale(img[row][col])
        }
    }
    gauss_filter(dimg)
    for (var row = 0;row<heigth;row++)
    {
        for (var col = 0; col<width;col++)
        {
            dimg[row][col] = getRgb(dimg[row][col]).toUpperCase();
        }
    }
    return [img,dimg];
}
fs = require("fs");
var data = fs.readFileSync("xleb.txt", "utf8");
data = data.split(",");
img = readTrik(data)
// dimg = img[1]
img = img[0]
s = '';
for (var row = 0;row<heigth;row++)
{
    for (var col = 0;col<width;col++)
    {
        s = s + img[row][col] + " ";
    }
    s =s + "\n"
}
fs.writeFileSync("help.txt",s)