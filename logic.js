var qrcodesize=350;
var qrcodeborder=40;
var targetx=1920;
var targety=1080;
var filename="filename.png";

function onUpload() {
    let fileObj = document.getElementById('fileupload');
    let file;
    if (fileObj.files) {
        file = fileObj.files[0]
        console.log("1");
        filename = file.name;
        var fr = new FileReader;
        fr.onloadend = displayImg;
        fr.readAsDataURL(file);
    } else {
        file = fileObj.value;
        filename = file.name;
        displayImg(file);
    };
};
function displayImg(file) {
    if(typeof file === "object") {
        file = file.target.result; // file reader
    }
    document.getElementById("image").setAttribute("src",file);
    let ctx = document.getElementById("canvas").getContext("2d");
    var background = new Image();
    background.src = file;
    background.addEventListener('load', function() {
        console.log("background loaded");
        ctx.drawImage(background,0,0,targetx,targety);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect((targetx/2-qrcodesize/2-qrcodeborder), targety-(qrcodesize+qrcodeborder*2), qrcodesize+qrcodeborder*2, qrcodesize+qrcodeborder*2);
        ctx.font = '48px sans-serif';

        ctx.save();
        ctx.fillStyle = '#FF0000';
        ctx.translate(targetx/2-qrcodesize/2-qrcodeborder-qrcodeborder/3, targety-qrcodesize/2-qrcodeborder);
        ctx.rotate(-Math.PI/2);
        ctx.textAlign = "center";
        ctx.strokeStyle = 'white';

        ctx.miterLimit = 2;
        ctx.lineJoin = 'circle';

        // draw an outline, then filled
        ctx.lineWidth = 17;
        ctx.strokeText("Emergency Location", 0, 0);
        ctx.lineWidth = 1;

        ctx.fillText("Emergency Location", 0, 0);
        ctx.restore();

        // https://davidshimjs.github.io/qrcodejs/
        var qrcontent = document.getElementById("qrcontent").value;
        console.log(qrcontent);
        //clear qrcode
        document.getElementById("qrcode").innerHTML = "";
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            text: qrcontent,
            width: qrcodesize, height: qrcodesize,
            correctLevel : QRCode.CorrectLevel.H
        });
        console.log("qr code generated")
        var qrcodeImg = document.querySelector("#qrcode canvas");
        ctx.drawImage(qrcodeImg,(targetx/2-qrcodesize/2),targety-qrcodesize-qrcodeborder);
        window.setTimeout(function() {
            ctx.drawImage(qrcodeImg,(targetx/2-qrcodesize/2),targety-qrcodesize-qrcodeborder);
            console.log("timeout");
        }, 1000)
        qrcodeImg.addEventListener('load', function() {
            console.log("qr code loaded")
            ctx.drawImage(qrcodeImg,(targetx/2-qrcodesize/2),targety-qrcodesize-qrcodeborder);
        }, false);

    }, false);

}
function download() {
    var link = document.createElement('a');
    link.download = "vikoqr-"+filename;
    link.href = document.getElementById('canvas').toDataURL()
    link.click();
}
