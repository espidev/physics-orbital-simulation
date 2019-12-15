let speed = 24*3600/50;
let movingObjects = [];
let GRAVITATIONAL_CONSTANT = 6.67408e-11;
let fps = 60;

const AU = (149.6e6 * 1000);
let scalevalue = 50;
let SCALE = scalevalue / AU;

function distBetweenTwoObj(objectA, objectB) {
    return Math.sqrt((objectB.posX-objectA.posX)*(objectB.posX-objectA.posX)+(objectB.posY-objectA.posY)*(objectB.posY-objectA.posY));
}

// is magnitude, use angleBetweenTwoObj to find angle
function forceBetweenTwoObj(objectA, objectB) {
    let dist = distBetweenTwoObj(objectA, objectB);
    return (GRAVITATIONAL_CONSTANT * objectA.mass * objectB.mass) / (dist*dist);
}

// returns the angle in radians with the x axis from 0 degrees (right) for objectA (< 90deg)
function angleBetweenTwoObj(objectA, objectB) {
    let deltaX = objectB.posX-objectA.posX;
    let deltaY = objectB.posY-objectA.posY;
    return Math.atan(deltaY-deltaX);
}

class MovingObject {

    // all units in SI
    constructor() {
        this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.mass = 3e+24;
        this.posX = 0.0;
        this.posY = 0.0;
        this.velX = 0.0;
        this.velY = 0.0;
        this.accelX = 0.0;
        this.accelY = 0.0;
        this.color = "#FFFFFF";
    }

    calcAccel() {
        this.accelX = 0;
        this.accelY = 0;
        movingObjects.forEach(obj => {
            if (obj !== this) {
                let force = forceBetweenTwoObj(this, obj);
                let rad = angleBetweenTwoObj(this, obj);

                // use minus to reverse vector
                this.accelX -= (force * Math.cos(rad)) / this.mass;
                this.accelY -= (force * Math.sin(rad)) / this.mass;
            }
        });
    }

    calcVelocity() {
        this.velX += this.accelX * speed;
        this.velY += this.accelY * speed;
        this.calcPosition();
    }

    calcPosition() {
        this.posX += this.velX * speed;
        this.posY += this.velY * speed;
    }

    draw (ctx) {
        ctx.lineWidth = 3;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(this.posX*SCALE, this.posY*SCALE, 3, 0, 2*Math.PI, false);
        ctx.fill();
    }
}

let sun = new MovingObject({
    id: "sun",
    mass: 1.989e30,
    posX: 0,
    posY: 0,
    velX: 0,
    velY: 0,
    accelX: 0,
    accelY: 0,
    color: "yellow",
});

let earth = new MovingObject({
    id: "earth",
    mass: 5.972e24,
    posX: -147.09e6*1000,
    posY: 0,
    velX: 30290,
    velY: 0,
    color: "blue",
});

function createMovingObject() {
    let obj = new MovingObject();
    movingObjects.push(obj);
    return obj;
}


function frames() {
    setTimeout(function() {

    }, 1000/60);
}

frames();