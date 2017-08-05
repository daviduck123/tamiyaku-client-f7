var cPushArray = new Array();
var cStep = -1; //Set -1 because array started from 0
    
function cPush() {
    cStep++; //every push, this index should be ++
    if (cStep < cPushArray.length) { cPushArray.length = cStep; }
    cPushArray.push(document.getElementById('myCanvas').toDataURL()); //put current Canvas Image to Array
}

function cUndo() {
    if (cStep >= 0) {
        cStep--;
        if(cStep >= 0){
            var canvasPic = new Image();
            canvasPic.src = cPushArray[cStep]; //Take current Array Image
            canvasPic.onload = function () {  //Every Load, refresh the canvas
                cClear();
                ctx.drawImage(canvasPic, 0, 0);  //Draw Canvas based on current Image
            }
        }else{
            cClear();
        }
        
    }
}

function cRedo() {
    if (cStep < cPushArray.length - 1) {
        cStep++;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () { 
            cClear();
            ctx.drawImage(canvasPic, 0, 0); 
        }
    }
}

function cClear() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear Canvas and redraw based on witdh and height

    ctx.strokeStyle="silver"; //grid color
    var w = canvas.width;
    var h = canvas.height;
    var width = $('.draggableItem').width();
    for (x=0;x<=w;x+=width) {
        for (y=0;y<=h;y+=width) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }
}

function gambar() {
    viewRouterBack();
}

function bindDraggableTrack(){
    cPushArray = new Array();
    cStep = -1;
    ctx;
    $('.draggableItem').draggable({ helper: "clone" });

    var canvas = $('#myCanvas') ;
    ctx = canvas.get(0).getContext('2d') ;
    ctx.strokeStyle="silver"; //grid color
    var w = 300;
    var h = 300;
    var width = $('.draggableItem').width();
    for (x=0;x<=w;x+=width) {
        for (y=0;y<=h;y+=width) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }

    $('#myCanvas').droppable({
        drop: function( event, ui ) {
            //300x300
            //30x30
            var $canvas = $('#myCanvas') ;
            ctx = $canvas.get(0).getContext('2d') ;
            var $img = $(ui.helper) ;
            
            var imgpos = $img.offset() ; //Get Image draggable offset
            var cpos = $canvas.offset() ; //Get Canvas offset

            //put image into canvas
            var left = imgpos.left-cpos.left; 
            var top = imgpos.top-cpos.top;

            var posisiLeft = parseInt(left / $img.width()) * $img.width(); //Pak Ricahrd code
            var posisiTop = parseInt(top / $img.height()) * $img.height(); //Pak Ricahrd code

            //Dra Image (Object, x, y, width, height)
            ctx.drawImage($img.get(0),
                posisiLeft,
                posisiTop, $img.width(), $img.height()) ;
            cPush(); //Put into Array
        }
    });
}