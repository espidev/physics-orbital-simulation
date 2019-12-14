
class MovingObject {

    // all units in SI
    constructor() {
        this.name = "";
        this.mass = 0.0;
        this.posX = 0.0;
        this.posY = 0.0;
        this.velX = 0.0;
        this.velY = 0.0;
        this.accelX = 0.0;
        this.accelY = 0.0;
    }

}

let movingObjects = [];

let GRAVITATIONAL_CONSTANT = 6.67408e-11;

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

function createMovingObject() {
    movingObjects.push(new MovingObject());
}

// calculate motion
function calcTimeFrame(seconds) {
    for (let i = 0; i < seconds; i++) {
        calcForce();
        calcVelocity(1);
        calcDisplacement(1);
    }
}

function calcDisplacement(seconds) {
    for (let i = 0; i < movingObjects.length; i++) {
        let objA = movingObjects[i];
        objA.posX += objA.velX * seconds;
        objA.posY += objA.velY * seconds;
    }
}

function calcVelocity(seconds) {
    for (let i = 0; i < movingObjects.length; i++) {
        let objA = movingObjects[i];
        objA.velX += objA.accelX * seconds;
        objA.velY += objA.accelY * seconds;
    }
}

// calculates acceleration, should technically be called for every movement but the computer is not fast enough
function calcForce() {
    for (let i = 0; i < movingObjects.length; i++) {
        let objA = movingObjects[i];
        objA.accelX = 0;
        objA.accelY = 0;
        for (let j = 0; j < movingObjects; j++) {
            if (i === j) continue;

            let objB = movingObjects[j];
            let force = forceBetweenTwoObj(objA, objB);
            let rad = angleBetweenTwoObj(objA, objB);

            // use minus to reverse vector
            objA.accelX -= (force * Math.cos(rad)) / objA.mass;
            objA.accelY -= (force * Math.sin(rad)) / objA.mass;
        }
    }
}