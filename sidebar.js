

function onCreateCard() {
    obj = createMovingObject();
    $("#cards").append(`
    <div class="card sidebar-elem">
        <b>` + obj.id + `</b>
        <div>Mass: <input type="number" id="` + obj.id + `-mass" value="` + obj.mass + `"> kg</div>
        <div>PosX: <input type="number" id="` + obj.id + `-posx" value="` + obj.posX + `"></div>
        <div>PosY: <input type="number" id="` + obj.id + `-posy" value="` + obj.posY + `"></div>
        <div>VelX: <input type="number" id="` + obj.id + `-velx" value="` + obj.velX + `"> m/s</div>
        <div>VelY: <input type="number" id="` + obj.id + `-vely" value="` + obj.velY + `"> m/s</div>
        <div>AccelX: <input type="number" id="` + obj.id + `-accelx" value="` + obj.accelX + `"> m/s2</div>
        <div>AccelY: <input type="number" id="` + obj.id + `-accely" value="` + obj.accelY + `"> m/s2</div>
    </div>
    `);
}

function updateCards() {
    movingObjects.forEach(obj => {
        $("#" + obj.id + "-mass").val(obj.mass);
        $("#" + obj.id + "-posx").val(obj.posX);
        $("#" + obj.id + "-posy").val(obj.posY);
        $("#" + obj.id + "-velx").val(obj.velX);
        $("#" + obj.id + "-vely").val(obj.velY);
        $("#" + obj.id + "-accelx").val(obj.accelX);
        $("#" + obj.id + "-accely").val(obj.accelY);
    });
}