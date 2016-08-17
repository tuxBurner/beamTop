var beamTopCfg = {
  battlfield: {
    background: 'images/backgrounds/testbg.jpg',
    width: 90,
    height: 90
  },
  tileSize: 4,
  tileRatio: 4,
  tools : {
   lineOne : {
      img : 'images/tools/lineone.png',
      width: 2,
      height: 4
    },
    cornerOne : {
       img : 'images/tools/cornerone.png',
       width: 4,
       height: 4
     },
    lineTwo : {
      img:  'images/tools/linetwo.png',
      width: 2,
      height: 8
    }
  }
}


var beamTop = {};
beamTop.fabric = {};
beamTop.init = function() {
  window.onresize = function() {
    beamTop.resizeCanvas();
  }

  beamTop.resizeCanvas();
  beamTop.addToolsButtons();
};

beamTop.resizeCanvas = function() {

  var canvas = document.getElementById('canvas');

  beamTop.width = window.innerWidth;
  beamTop.height = window.innerHeight;

  canvas.width = beamTop.width;
  canvas.height = beamTop.height;

  /**
   * Your drawings need to be inside this function otherwise they will be reset when
   * you resize the browser window and the canvas goes will be cleared.
   */
  beamTop.drawStuff();
}


beamTop.drawStuff = function() {


  beamTop.canvas = new fabric.Canvas('canvas', {
    backgroundColor: 'rgb(0,0,0)'
  });

  beamTop.calculateBattleFieldDims();

  fabric.Image.fromURL(beamTopCfg.battlfield.background, function(oImg) {
    oImg.set({
      top: beamTop.battlfield.dims.y0,
      left: beamTop.battlfield.dims.x0,
      width: beamTop.battlfield.dims.width,
      height: beamTop.battlfield.dims.height,
      hasControls: false,
      selectable: false,
      hasBorders: true,
      borderColor: 'red',
      borderSize: 5,
      lockMovementY: true,
      lockMovementX: true
    });
    beamTop.fabric.background = oImg;
    beamTop.canvas.add(oImg);
    beamTop.drawGrid();
  });

  for(var toolsIdx in beamTopCfg.tools) {
    beamTop.fabric.tools = {};

    beamTop.addTool(toolsIdx);
  }
}

beamTop.addTool = function(toolName) {
  var tool = beamTopCfg.tools[toolName];
  fabric.Image.fromURL(tool.img, function(oImg) {

   var toolDims = beamTop.calcToolSize(toolName);

    oImg.set({
      top: beamTop.battlfield.dims.y0,
      left: beamTop.battlfield.dims.x0,
      width: toolDims.width,
      height: toolDims.height,
      visible: false,
      hasControls: true,
      hasBorders: true,
      selectable: true,
      evented: true,
      centeredRotation: true,
      padding: 20,
      borderColor: '#34d262',
      cornerColor: '#34d262'
    });

    oImg.setControlsVisibility({
       mt: false,
       mb: false,
       ml: false,
       mr: false,
       bl: false,
       br: false,
       tl: false,
       tr: false,
       mtr: true
    });

    beamTop.fabric.tools[toolName] = oImg;
    beamTop.canvas.add(oImg);
  });
}

//canvas.clear().renderAll();

beamTop.calculateBattleFieldDims = function() {
  var ratio = beamTopCfg.tileRatio;

  beamTop.battlfield = {};
  beamTop.battlfield.dims = {};

  beamTop.battlfield.dims.width = beamTopCfg.battlfield.width * ratio;
  beamTop.battlfield.dims.height = beamTopCfg.battlfield.height * ratio;
  beamTop.battlfield.dims.x0 = (beamTop.width - beamTop.battlfield.dims.width) / 2;
  beamTop.battlfield.dims.y0 = (beamTop.height - beamTop.battlfield.dims.height) / 2;
}

beamTop.drawGrid = function() {
  var oCanvas = beamTop.canvas;

  var gridWidth = beamTop.battlfield.dims.width; // <= you must define this with final grid width
  var gridHeight = beamTop.battlfield.dims.height; // <= you must define this with final grid height

  var gridSize = beamTopCfg.tileSize * beamTopCfg.tileRatio; // define grid size


  // calculate the position of the grid so it is in the middle
  var gridPosX = beamTop.battlfield.dims.x0;
  var gridPosY = beamTop.battlfield.dims.y0;

  // to manipulate grid after creation
  var oGridGroup = new fabric.Group([], {
    left: gridPosX,
    top: gridPosY,
    hasControls: false
  });



  // define presentation option of grid
  var lineOption = {
    stroke: 'rgba(255,255,255,.4)',
    strokeWidth: 1,
    selectable: false,
    strokeDashArray: [3, 3]
  };

  // do in two steps to limit the calculations
  // first loop for vertical line
  for (var i = Math.ceil(gridWidth / gridSize); i--;) {
    oGridGroup.add(new fabric.Line([gridSize * i, 0, gridSize * i, gridHeight], lineOption));
  }
  // second loop for horizontal line
  for (var i = Math.ceil(gridHeight / gridSize); i--;) {
    oGridGroup.add(new fabric.Line([0, gridSize * i, gridWidth, gridSize * i], lineOption));
  }

  beamTop.fabric.grid = oGridGroup;

  // Group add to canvas
  oCanvas.add(oGridGroup);

}

beamTop.makeToolActive = function() {
  if(beamTop.currentTool !== null && beamTop.currentTool !== undefined) {
    beamTop.canvas.setActiveObject(beamTop.currentTool);
  }
}

beamTop.resize = function() {
  beamTop.calculateBattleFieldDims();
  beamTop.fabric.background.set({
    top: beamTop.battlfield.dims.y0,
    left: beamTop.battlfield.dims.x0,
    width: beamTop.battlfield.dims.width,
    height: beamTop.battlfield.dims.height
  });
  beamTop.canvas.remove(beamTop.fabric.grid);
  beamTop.drawGrid();
  beamTop.resizeTools();
  beamTop.makeToolActive();
  beamTop.canvas.renderAll();
}

beamTop.resizeTools = function() {
  for(toolsIdx in beamTop.fabric.tools) {
    var toolImg = beamTop.fabric.tools[toolsIdx];
    var toolDims = beamTop.calcToolSize(toolsIdx);
    toolImg.set({
      width: toolDims.width,
      height: toolDims.height
    });
  }
}

beamTop.calcToolSize = function(toolName) {
  var tool = beamTopCfg.tools[toolName];
  var ratio = beamTopCfg.tileRatio;
  var result = {
    height : tool.height * ratio,
    width  : tool.width * ratio
  };
  return result;
}

beamTop.selectTool = function(toolName) {

    var currentTool = beamTop.currentTool;
    if(currentTool !== null && currentTool !== undefined) {
      beamTop.currentTool.visible = false;
    }

  if(toolName === 'deleteTool') {
    beamTop.currentTool = null;
    canvas.deactivateAll().renderAll();
  } else {
    beamTop.currentTool = beamTop.fabric.tools[toolName];
    beamTop.currentTool.visible = true;
    beamTop.canvas.setActiveObject(beamTop.currentTool);
  }

  beamTop.canvas.renderAll();
}


beamTop.addToolsButtons = function() {
  for(toolsIdx in beamTopCfg.tools) {
    $('#toolsSelect').append('<option value="'+toolsIdx+'">'+toolsIdx+'</option>');
  }

  $('#toolsSelect').on('change', function() {
    var toolName = $(this).val();
    beamTop.selectTool(toolName);
  });
}

$(function() {

  $('#gridRatio-control').on('input', function() {
    var gridRatio = $(this).val();
    beamTopCfg.tileRatio = gridRatio / 1000;
    beamTop.resize();
  });

  $('#hide-grid-btn').on('click', function() {
    var visible = !beamTop.fabric.grid.visible;
    beamTop.fabric.grid.visible = visible;
    beamTop.makeToolActive();
    beamTop.canvas.renderAll();
  });

  beamTop.init();
});
