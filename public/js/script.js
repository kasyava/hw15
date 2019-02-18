let baseUrl;

$(()=>{
    baseUrl = location.hostname+(location.port ? ':'+location.port: '');
    const urlWs = `ws://${baseUrl}/chat`;

    const websocket = new WebSocket(urlWs);
    const paintBoard = document.getElementById("paintBoard");
    let ctx = paintBoard.getContext("2d");

    let colorPicker = document.getElementById("colorPicker");
    ctx.fillStyle= colorPicker.value;

    let radiusInput = document.getElementById("radius");


    colorPicker.addEventListener("input", function() {

        ctx.fillStyle= colorPicker.value;
    }, false);


    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        paintBoard.width = window.innerWidth;
        paintBoard.height = window.innerHeight-50;
    }
    resizeCanvas();


    paintBoard.addEventListener('click', function(event) {
        let rect = paintBoard.getBoundingClientRect();

        const message = {
            xCorr: (event.clientX - rect.left),
            yCorr: (event.clientY - rect.top),
            color: colorPicker.value,
            radius: radiusInput.value
        };
        websocket.send(JSON.stringify(message));
    }, false);

    const paintOnBoard = (data) => {
        ctx.beginPath();
        ctx.fillStyle = data.color;
        ctx.arc(data.xCorr, data.yCorr, data.radius,0,2*Math.PI, false);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = data.color;
        ctx.stroke();
    };

    websocket.onmessage = function (msg) {
        paintOnBoard(JSON.parse(msg.data));
    };
});