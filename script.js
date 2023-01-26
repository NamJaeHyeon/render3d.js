if (!!window.WebGLRenderingContext) {
    console.log("WebGL supported");
} else {
    console.log("WebGL not supported");
}

class Object3D {
    constructor(tagName){
        this.tagName = tagName;
        this.points = [];
        this.polygons = [];
    }
}

class Renderer{
    #points;
    #polygon;
    #camera;
    #polygonTag;
    #setting;
    #canvas;
    constructor(setting){
        if(setting)if(!Number.isInteger(setting)) throw new Error('setting value must be integer.');
        this.#points = [];
        this.#polygon = [];
        this.#camera = [0,0,0,0,0,0];
        this.#polygonTag = {};
        this.#setting = setting; // &0b01:active rotZ, &0b10:use float64Array.
        this.#canvas;
    }
    newPoint(x,y,z){
        let a;
        if(this.#setting&10) a = Float64Array(3);
        else a = Float32Array(3);
        a[0]=x;
        a[1]=y;
        a[2]=z;
        return a;
    }
    isPoint(p){
        return ArrayBuffer.isView(p) && p.length==3;
    }
    setCamera(x,y,z,rotX,rotY,rotZ){
        this.#camera = [x,y,z,rotX,rotY,rotZ];
    }
    addObject(points,polygons,tagName){
        let pointsLength = this.#points.length;
        let checkParam1 = points.some(x=>x.length!==3||this.isPoint(x));
        if(checkParam1) throw new Error('the points, the first parameter of addObject method : must be a undefined or An array of floatArray of length 3.');
        let checkParam2 = polygons.some(x=>x.length!==3||x.some(y=>typeof(y)!=='number'||y<0));
        if(checkParam2) throw new Error('the polygons, the second parameter of addObject method : must be a undefined or An array of arrays of length 3 containing only number types.');
        if(!tagName || typeof(tagName) !== 'string'){
            tagName = +new Date+(Math.random()*1e5+"").slice(0,5);
            console.log('rejected tagName : empty or not string of 1 or more characters\nrenamed : '+tagName);
        }
        if(tagName in this.#polygonTag) throw new Error('duplicate tagName : '+tagName);
        if(points) this.#points = this.#points.concat(points); // if points is undefined, checkParam1 is also false.
        if(polygons){
            polygons = polygons.map(x=>x.map(y=>y+pointsLength));
            this.#polygon = this.#polygon.concat(polygons.map(x=>x.map(y=>y+pointsLength))); // if polygons is undefined, checkParam1 is also false.
        }
        this.#polygonTag[tagName] = [this.#polygon.length - polygons.length,this.#polygon.length];
        return;
    }
    removeObject(tagName){
        // if(!(tagName in this.#polygonTag)) throw new Error(tagName+' does not exist in the list.');
        // let tag_ = this.#polygonTag[tagName];
        // let polygonLength = tag_[1]-tag_[0];
        // let p1 = this.#points.slice(0,tag_[0]);
        // let p2 = this.#points.slice(tag_[1]).map(x=>x)
        // this.#polygon = this.#polygon.map(x=>x)
    }
    getObject(tagName){

    }
    getPolygonTagList(){
        return Object.keys(this.#polygonTag);
    }
    rasterisation(){
        let [s,c] = [Math.sin,Math.cos];
        let [rotX,rotY,rotz] = [this.#camera.rotX,this.#camera.rotY,this.#camera.rotZ];
        let [sx,sy,cx,cy] = [s(rotX),s(rotY),c(rotX),c(rotY)];
        let rotationMatrix;
        if(this.#setting&1)rotationMatrix = [[cy,0,-sy],[cx*sy,sx,cx*cy],[-sx*sy,cx,-sx*cy]];
        else rotationMatrix = [[cy,0,-sy],[cx*sy,sx,cx*cy],[-sx*sy,cx,-sx*cy]];
        let matrixProduct = x=>rotationMatrix.map(y=>x[0]*y[0]+x[1]*y[1]+x[2]*y[2]);
        let rotatedPoints = this.#points.map(matrixProduct);
        return rotatedPoints;
    }
}
