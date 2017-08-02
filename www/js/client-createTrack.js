var cPushArray = new Array();
var cStep = 0;
// ctx = document.getElementById('myCanvas').getContext("2d");
    
function cPush() {
    cStep++;
    if (cStep < cPushArray.length) { cPushArray.length = cStep; }
    cPushArray.push(document.getElementById('myCanvas').toDataURL());
}

function cUndo() {
    if (cStep > 0) {
        cStep--;
        if(cStep > 0){
            var canvasPic = new Image();
            canvasPic.src = cPushArray[cStep];
            canvasPic.onload = function () { 
                cClear();
                ctx.drawImage(canvasPic, 0, 0); 
            }
        }else{
            cClear();
            var canvas = $('#myCanvas') ;
            ctx = canvas.get(0).getContext('2d') ;
            ctx.strokeStyle="silver";
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
        }
        
    }
}

function cRedo() {
    if (cStep < cPushArray.length-1) {
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
    var context = canvas.getContext('2d');
    
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function gambar() {
    viewRouterBack();
}

function bindDraggableTrack(){
    cPushArray = new Array();
    cStep = 0;
    ctx;
    $('.draggableItem').draggable({ helper: "clone" });

    var canvas = $('#myCanvas') ;
    ctx = canvas.get(0).getContext('2d') ;
    ctx.strokeStyle="silver";
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
            
            var imgpos = $img.offset() ;
            var cpos = $canvas.offset() ;

            var left = imgpos.left-cpos.left;
            var top = imgpos.top-cpos.top;

            var posisiLeft = parseInt(left / $img.width()) * $img.width();
            var posisiTop = parseInt(top / $img.height()) * $img.height();

            ctx.drawImage($img.get(0),
                posisiLeft,
                posisiTop, $img.width(), $img.height()) ;
            cPush();
        }
    });
}