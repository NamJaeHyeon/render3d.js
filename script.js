if (!!window.WebGLRenderingContext) {
    console.log("WebGL supported");
} else {
    console.log("WebGL not supported");
}

class Renderer{
    constructor(){
        this.points = [];
        this.polygon = [];
        this.camera = {x:0,y:0,z:0,rotX:0,rotY:0,rotZ:0};
        this.polygonTag = {};
    }
    addObject(points,polygons,tagName){
        let pointsLength = this.points.length;
        let checkParam1 = points.some(x=>x.length!==3||x.some(y=>typeof(y)!=='number'));
        if(checkParam1) throw new Error('the points, the first parameter of addObject method : must be a undefined or An array of arrays of length 3 containing only number types.');
        let checkParam2 = polygons.some(x=>x.length!==3||x.some(y=>typeof(y)!=='number'||y<0));
        if(checkParam2) throw new Error('the polygons, the second parameter of addObject method : must be a undefined or An array of arrays of length 3 containing only number types.');
        if(!tagName || typeof(tagName) !== 'string'){
            tagName = +new Date+(Math.random()*1e5+"").slice(0,5);
            console.log('rejected tagName : empty or not string of 1 or more characters\nrenamed : '+tagName);
        }
        if(tagName in this.polygonTag) throw new Error('duplicate tagName : '+tagName);

        if(points) this.points = this.points.concat(points); // if points is undefined, checkParam1 is also false.
        if(polygons){
            polygons = polygons.map(x=>x.map(y=>y+pointsLength));
            this.polygon = this.polygon.concat(polygons.map(x=>x.map(y=>y+pointsLength))); // if polygons is undefined, checkParam1 is also false.
        }
        this.polygonTag[tagName] = [this.polygon.length - polygons.length,this.polygon.length];
        return;
    }
    removeObject(tagName){
        
    }
    getObject(tagName){

    }
    getPolygonTagList(){
        return Object.keys(this.polygonTag);
    }
    render(){
        let [s,c] = [Math.sin,Math.cos];
        let [rotX,rotY] = [this.camera.rotX,this.camera.rotY];
        let [sx,sy,cx,cy] = [s(rotX),s(rotY),c(rotX),c(rotY)];
        let rotationMatrix = [[cy,0,-sy],[cx*sy,sx,cx*cy],[-sx*sy,cx,-sx*cy]];
        let matrixProduct = x=>rotationMatrix.map(y=>x[0]*y[0]+x[1]*y[1]+x[2]*y[2]);
        let rotatedPoints = this.points.map(matrixProduct);
        return rotatedPoints;
    }
}