function toggleAnimation() {
    let button = $("#play");
    if (animationOn) {
        button.text("Play");
        $("#add-mass").toggle();
    } else {
        button.text("Pause");
        $("#add-mass").toggle();
    }
    animationOn = !animationOn;
}

function listenInput(objId, type, ind, call) {
    $("#" + objId + "-" + type).on('input', () => {
        call(movingObjects[ind], $("#" + objId + "-" + type).val());
    });
}

function createCard(obj) {
    $("#cards").prepend(`
    <div class="card sidebar-elem" id="` + obj.id + `">
        <b>` + obj.id + `</b>
        <div>Mass: <input type="number" id="` + obj.id + `-mass" value="` + obj.mass + `"> kg</div>
        <div>PosX: <input type="number" id="` + obj.id + `-posx" value="` + obj.posX + `"> m</div>
        <div>PosY: <input type="number" id="` + obj.id + `-posy" value="` + obj.posY + `"> m</div>
        <div>VelX: <input type="number" id="` + obj.id + `-velx" value="` + obj.velX + `"> m/s</div>
        <div>VelY: <input type="number" id="` + obj.id + `-vely" value="` + obj.velY + `"> m/s</div>
        <div>AccelX: <input type="number" id="` + obj.id + `-accelx" value="` + obj.accelX + `" disabled> m/s2</div>
        <div>AccelY: <input type="number" id="` + obj.id + `-accely" value="` + obj.accelY + `" disabled> m/s2</div>
    </div>
    `);

    let index = movingObjects.length - 1;
    listenInput(obj.id, "mass", index, (e, v) => e.mass = v);
    listenInput(obj.id, "posx", index, (e, v) => e.posX = v);
    listenInput(obj.id, "posy", index, (e, v) => e.posY = v);
    listenInput(obj.id, "velx", index, (e, v) => e.velX = v);
    listenInput(obj.id, "vely", index, (e, v) => e.velY = v);
}

function onCreateCard() {
    createCard(createMovingObject());
}

function addPrebuilt() {
    let v = $("#add-prebuilt :selected").text();
    let obj;
    switch (v) {
        case "Betelgeuse":
            obj = betelgeuse;
            break;
        case "Sun":
            obj = sun;
            break;
        case "Earth":
            obj = earth;
            break;
        case "Jupiter":
            obj = jupiter;
            break;
        case "Pluto":
            obj = pluto;
            break;
    }
    obj = new MovingObject(obj);
    movingObjects.push(obj);
    createCard(obj);
}

function updateCards() {
    movingObjects.forEach(obj => {
        if (document.getElementById(obj.id) === null) {
            createCard(obj);
        } else {
            $("#" + obj.id + "-mass").val(obj.mass);
            $("#" + obj.id + "-posx").val(obj.posX);
            $("#" + obj.id + "-posy").val(obj.posY);
            $("#" + obj.id + "-velx").val(obj.velX);
            $("#" + obj.id + "-vely").val(obj.velY);
            $("#" + obj.id + "-accelx").val(obj.accelX);
            $("#" + obj.id + "-accely").val(obj.accelY);
        }
    });
}

function changeSpeed(change) {
    daysPerSecond = change;
    speed = 24*60*daysPerSecond;
    $("speedVal").text(daysPerSecond);
}

function changeZoom(delta) {
    zoomVal += delta;
    zoom = zoomVal / ASTRONOMICAL_UNIT;
}