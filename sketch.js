var nSteps = 8;
var nTracks = 4;
var kit;
var cellWidth, cellHeight;
var beats = 0;
var cells = [];
var currentStep = 0;
var playButton;

var drumNames = ["hho", "hh", "snare", "kick"];
kit = new Tone.Players(
  {"hho" : "/samples/505/hho.mp3",
		"hh" : "/samples/505/hh.mp3",
    "snare" : "/samples/505/snare.mp3",
    "kick" : "/samples/505/kick.mp3"
  });

kit.toMaster();
Tone.Transport.bpm.value = 180;
Tone.Transport.scheduleRepeat(onBeat, "8n");

function setup(){
  createCanvas(600,300);
	cellWidth = width/nSteps;
	cellHeight = height/nTracks;
  
  for(var track=0; track<nTracks; track++){
  	cells[track] = [];
    for(var step=0; step<nSteps; step++){
    	cells[track][step] = -1;
    }
  }  
  playButton = createButton('Play');
  playButton.position(550, 300);
  playButton.mouseClicked(togglePlay);
}

function onBeat(time){
	for(var track=0; track<nTracks; track++){
  	if(cells[track][currentStep] == 1){
    	var drum = kit.get(drumNames[track]);
      drum.start(time);
    }
  }
  beats++;
  currentStep = (beats) % nSteps;

  console.log(beats, currentStep);
}

function draw(){
	background(255);
  stroke(0);
	
  for(var track=0; track<nTracks; track++){
  	for(var step=0; step<nSteps; step++){
  		if(cells[track][step] == 1){
        fill(150 - track*30);
        rect(step*cellWidth,track*cellHeight,cellWidth, cellHeight);
      }
  	}
  }
  
  //vertical lines
  for(var i=0; i<nSteps; i++){
  	line(i*cellWidth,0,i*cellWidth,height);
  }
  
  //horizontal lines
  for(var j=0; j<nTracks; j++){
  	line(0,j*cellHeight,width,j*cellHeight);
  }
  
  highlight = (beats-1) % nSteps;
	fill(200, 60);
	noStroke();
	rect(highlight*cellWidth, 0, cellWidth, height);
  
}

function mousePressed(){
	if(0<mouseX && mouseX<width && 
     0<mouseY && mouseY<height){
    
  	var i = floor(mouseX/cellWidth);
    var j = floor(mouseY/cellHeight);
    
    cells[j][i] = -cells[j][i];
  }
}

function togglePlay(){
	if(Tone.Transport.state == "started"){
  	Tone.Transport.stop();
    playButton.html('Play');
  } else {
  	Tone.Transport.start();
    playButton.html('Stop');
  }
}
