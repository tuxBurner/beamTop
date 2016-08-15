var beamTopCfg = {
  battlfield: {
    background : 'images/backgrounds/testbg.jpg',
    width: 90,
    height: 90
  },
  tileSize: 4,
  tileRatio: 4
}


var beamTop = {};
beamTop.fabric = {};
beamTop.init = function() {
  window.onresize = function() {
    beamTop.resizeCanvas();
  }

  beamTop.resizeCanvas();
};

beamTop.resizeCanvas = function() {

  var canvas = document.getElementById('canvas');

        beamTop.width =window.innerWidth;
        beamTop.height= window.innerHeight;

        canvas.width = beamTop.width;
        canvas.height = beamTop.height;

        /**
         * Your drawings need to be inside this function otherwise they will be reset when
         * you resize the browser window and the canvas goes will be cleared.
         */
        beamTop.drawStuff();
}


beamTop.drawStuff = function() {


   beamTop.canvas =  new fabric.Canvas('canvas',{
      backgroundColor: 'rgb(0,0,0)'
   });

  beamTop.calculateBattleFieldDims();

  fabric.Image.fromURL(beamTopCfg.battlfield.background, function(oImg) {
    oImg.set({
      top: beamTop.battlfield.dims.y0,
      left: beamTop.battlfield.dims.x0,
      width:  beamTop.battlfield.dims.width,
      height: beamTop.battlfield.dims.height,
      hasControls: false,
      selection: false,
      hasBorders: true,borderColor: 'red',borderSize: 5,
      lockMovementY: true,lockMovementX: true
    });
    beamTop.fabric.background = oImg;
    beamTop.canvas.add(oImg);
    beamTop.drawGrid();
  });
}

//canvas.clear().renderAll();

beamTop.calculateBattleFieldDims = function() {
  var ratio = beamTopCfg.tileRatio;

  beamTop.battlfield = {};
  beamTop.battlfield.dims = {};

  beamTop.battlfield.dims.width = beamTopCfg.battlfield.width*ratio;
  beamTop.battlfield.dims.height = beamTopCfg.battlfield.height*ratio;
  beamTop.battlfield.dims.x0 =(beamTop.width- beamTop.battlfield.dims.width)/2;
  beamTop.battlfield.dims.y0 = (beamTop.height - beamTop.battlfield.dims.height)/2;
}

beamTop.drawGrid = function() {
  var oCanvas = beamTop.canvas;

  var gridWidth = beamTop.battlfield.dims.width; // <= you must define this with final grid width
  var gridHeight = beamTop.battlfield.dims.height; // <= you must define this with final grid height

  var gridSize = beamTopCfg.tileSize*beamTopCfg.tileRatio; // define grid size


  // calculate the position of the grid so it is in the middle
  var gridPosX = beamTop.battlfield.dims.x0;
  var gridPosY = beamTop.battlfield.dims.y0;

  // to manipulate grid after creation
  var oGridGroup = new fabric.Group([], {left: gridPosX, top: gridPosY});



  // define presentation option of grid
  var lineOption = {stroke: 'rgba(255,255,255,.4)', strokeWidth: 1, selectable:false, strokeDashArray: [3, 3]};

  // do in two steps to limit the calculations
  // first loop for vertical line
  for(var i = Math.ceil(gridWidth/gridSize); i--;){
    oGridGroup.add( new fabric.Line([gridSize*i, 0, gridSize*i, gridHeight], lineOption) );
  }
  // second loop for horizontal line
  for(var i = Math.ceil(gridHeight/gridSize); i--;){
    oGridGroup.add( new fabric.Line([0, gridSize*i, gridWidth, gridSize*i], lineOption) );
  }

  beamTop.fabric.grid = oGridGroup;

  // Group add to canvas
  oCanvas.add(oGridGroup);

}

beamTop.resize = function() {
  beamTop.calculateBattleFieldDims();
  beamTop.fabric.background.set({top: beamTop.battlfield.dims.y0,
  left: beamTop.battlfield.dims.x0,
  width:  beamTop.battlfield.dims.width,
  height: beamTop.battlfield.dims.height});
  beamTop.canvas.remove(beamTop.fabric.grid);
  beamTop.drawGrid();
  beamTop.canvas.renderAll();
}




$(function() {

$('#gridRatio-control').on('input',function() {
  var gridRatio = $(this).val();
  beamTopCfg.tileRatio = gridRatio/1000;
  beamTop.resize();
});

  beamTop.init();
});
