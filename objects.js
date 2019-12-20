let movingObjects = [];

let canvas = $("#canvas");
let canvasCtx = canvas[0].getContext("2d");
let canvasWidth = 900, canvasHeight = 800;

const GRAVITATIONAL_CONSTANT = 6.67408e-11;
const ASTRONOMICAL_UNIT = (149.6e6 * 1000);

// need to divide by 60 because of the fps
let daysPerSecond = 45;
let speed = 24*60*60/60*daysPerSecond;

let zoomVal = 50;
let zoom = zoomVal / ASTRONOMICAL_UNIT;

let animationOn = false;

// -=-=-=-=-=-=-=-=-=-=-=-=-

// get distance between two objects
function distBetweenTwoObj(objectA, objectB) {
    return Math.sqrt(Math.pow(objectB.posX-objectA.posX, 2) + Math.pow(objectB.posY-objectA.posY, 2));
}

// get the magnitude of force between two objects
// use angleBetweenTwoObj to find angle
// (Gmm) / r^2
function forceBetweenTwoObj(objectA, objectB) {
    let dist = distBetweenTwoObj(objectA, objectB);
    return (GRAVITATIONAL_CONSTANT * objectA.mass * objectB.mass) / (dist*dist);
}

// returns the angle in radians with the x axis from 0 degrees (right) for objectA (< 90deg)
function angleBetweenTwoObj(objectA, objectB) {
    let deltaX = objectB.posX-objectA.posX;
    let deltaY = objectB.posY-objectA.posY;
    return Math.atan2(deltaY, deltaX);
}

// mass object
class MovingObject {

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    // all units in SI
    // calculate net force
    calcAccel() {
        this.accelX = 0;
        this.accelY = 0;
        movingObjects.forEach(obj => { // loop through all objects and add its force on this object
            if (obj !== this) {
                let force = forceBetweenTwoObj(this, obj);
                let rad = angleBetweenTwoObj(this, obj);

                // add vector
                this.accelX += (force * Math.cos(rad)) / this.mass; // turn force into acceleration
                this.accelY += (force * Math.sin(rad)) / this.mass;
            }
        });
    }

    // calculate velocity based on acceleration
    calcVelocity() {
        this.velX += this.accelX * speed;
        this.velY += this.accelY * speed;
    }

    // calculate position based on velocity
    calcPosition() {
        this.posX += this.velX * speed;
        this.posY += this.velY * speed;
    }

    draw (ctx) {
        ctx.lineWidth = 3;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(this.posX*zoom + canvasWidth/2, this.posY*zoom + canvasHeight/2, this.radius, 0, 2*Math.PI, false);
        ctx.fill();
    }
}

// prebuilt objects
let sun = new MovingObject({
    id: "sun",
    mass: 1.989e30,
    posX: 0,
    posY: 0,
    velX: 0,
    velY: 0,
    color: "yellow",
    radius: 8,
    accelX: 0,
    accelY: 0,
});

let earth = new MovingObject({
    id: "earth",
    mass: 5.972e24,
    posX: 147.09e6*1000, // dist from earth to sun in m
    posY: 0,
    velX: 0,
    velY: 30290,
    color: "blue",
    radius: 5,
    accelX: 0,
    accelY: 0,
});

let comet = new MovingObject({
    id: "comet",
    mass: 5.972e21,
    posX: 177.09e6*1000,
    posY: 0,
    velX: 10000,
    velY: 35290,
    color: "pink",
    radius: 3,
    accelX: 0,
    accelY: 0,
});

let betelgeuse = new MovingObject({
    id: "betelgeuse",
    mass: 2.188e31,
    posX: 247.09e6*1000,
    posY: 0,
    velX: 0,
    velY: 20290,
    color: "red",
    radius: 10,
    accelX: 0,
    accelY: 0,
});

let jupiter = new MovingObject({
    id: "jupiter",
    mass: 1.898e27,
    posX: 783.06e6*1000, // dist from earth to sun in m
    posY: 0,
    velX: 0,
    velY: 13070,
    color: "orange",
    radius: 7,
    accelX: 0,
    accelY: 0,
});

movingObjects.push(new MovingObject(sun), new MovingObject(earth), new MovingObject(comet));

// render a single frame
function render() {
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height); // clear screen
    movingObjects.forEach(obj => { // render each object
        try {
            obj.calcAccel();
            obj.calcVelocity();
            obj.calcPosition();
            obj.draw(canvasCtx);
        } catch (e) {} // catch undefined errors if the object is not initialized yet
    });
}

function createMovingObject() {
    let obj = new MovingObject({
        id: "planet",
        mass: 3e30,
        posX: -177.09e9,
        posY: 0,
        velX: 30000,
        velY: -30000,
        accelX: 0,
        accelY: 0,
        color: "purple",
        radius: 3,
    });
    movingObjects.push(obj);
    return obj;
}

updateCards();

// render frames
function frames() {
    setTimeout(function() {
        requestAnimationFrame(frames);

        if (animationOn) {
            render();
            updateCards();
        }
    }, 1000/60);
}

// start rendering frames
frames();