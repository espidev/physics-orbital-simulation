let movingObjects = [];

let canvas = $("#canvas");
let canvasCtx = canvas[0].getContext("2d");
let cWidth = 900, cHeight = 800;

const GRAVITATIONAL_CONSTANT = 6.67408e-11;
const ASTRONOMICAL_UNIT = (149.6e6 * 1000);

// need to divide by 60 because of the fps
let daysPerSecond = 45;
let speed = 24*60*60/60*daysPerSecond;

let zoomVal = 50;
let zoom = zoomVal / ASTRONOMICAL_UNIT;

let animationOn = false;

// TODO textures?
let sunTex = new Image();
let moonTex = new Image();
let earthTex = new Image();

sunTex.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
moonTex.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
earthTex.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';

// -=-=-=-=-=-=-=-=-=-=-=-=-

function distBetweenTwoObj(objectA, objectB) {
    return Math.sqrt(Math.pow(objectB.posX-objectA.posX, 2) + Math.pow(objectB.posY-objectA.posY, 2));
}

// is magnitude, use angleBetweenTwoObj to find angle
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

class MovingObject {

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    // all units in SI
    calcAccel() {
        this.accelX = 0;
        this.accelY = 0;
        movingObjects.forEach(obj => {
            if (obj !== this) {
                let force = forceBetweenTwoObj(this, obj);
                let rad = angleBetweenTwoObj(this, obj);

                // add vector
                this.accelX += (force * Math.cos(rad)) / this.mass;
                this.accelY += (force * Math.sin(rad)) / this.mass;
            }
        });
    }

    calcVelocity() {
        this.velX += this.accelX * speed;
        this.velY += this.accelY * speed;
    }

    calcPosition() {
        this.posX += this.velX * speed;
        this.posY += this.velY * speed;
    }

    draw (ctx) {
        ctx.lineWidth = 3;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        // console.log((this.posX*SCALE + cWidth/2) + " " + (this.posY*SCALE + cHeight/2));
        //ctx.drawImage(earthTex, this.posX*SCALE + cWidth/2, this.posY*SCALE + cHeight/2, 5, 5);
        ctx.arc(this.posX*zoom + cWidth/2, this.posY*zoom + cHeight/2, this.radius, 0, 2*Math.PI, false);
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

// the moon is useless and doesn't work
let moon = new MovingObject({
    id: "moon",
    mass: 7.3478e22,
    posX: (-147.09e6-384400)*1000,
    posY: 0,
    velX: 0,
    velY: 30290,
    color: "pink",
    radius: 2,
    accelX: 0,
    accelY: 0,
});

movingObjects.push(sun, earth);

function render() {
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    movingObjects.forEach(obj => {
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
        velX: 0,
        velY: 0,
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