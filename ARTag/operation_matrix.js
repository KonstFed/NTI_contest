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
