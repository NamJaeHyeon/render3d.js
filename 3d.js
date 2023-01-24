let dq = x=>document.querySelectorAll(x);

let target = dq('#cavas3d')[0];

class Render{
    constructor(name){

    }
    static points = [];
    static rotatedPoints = [];
    static poligon = [];
    static camera = {x:0,y:0,z:0,rotX:0,rotY:0,rotZ:0,sinRotX:0,sinRotY:0,sinRotZ:0,cosRotX:0,cosRotY:0,cosRotZ:0};
    static crossProductPoligon = [];
    static cosTheta = [];
    static renderOrder = [];
    static newCanvas(){}
    static render(){
        let [s,c] = [Math.sin,Math.cos];
        let [sx,sy,cx,cy] = [s(rotX),s(rotY),c(rotX),c(rotY)];
        let rotationMatrix = [[cy,0,-sy],[cx*sy,sx,cx*cy],[-sx*sy,cx,-sx*cy]];
        let matrixProduct = x=>rotationMatrix.map(y=>x[0]*y[0]+x[1]*y[1]+x[2]*y[2]);
        let rotatedPoints = points.map(matrixProduct);
        let poligon
    }
}

