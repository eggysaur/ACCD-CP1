let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/uJ2lsYDet/';
let video;
let label = "nothing";
let font;
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  font = "Schoolbell";

}
let camw = 375*.75;
let camh = 225*.75;
let pad = 40;
function setup() {
  let canvas = createCanvas(windowWidth-pad, windowHeight-pad);
  let container = document.getElementById('p5-container');
  if (container) {
    canvas.parent(container);
  }
  colorMode(HSB)
  // Create the video
  video = createCapture(VIDEO,{flipped:false});
  video.size(camw, camh);
  video.hide();

  // Start classifying
  classifier.classifyStart(video, gotResult);
}

let scene = 0;
function draw() {
  background(100);
  
  image(video, width - camw -pad, height - camh -pad);
  
  classifyUpdate()
  switch(scene){
    case 0: 
      gameStart();
      break;
    case 1:
      goodMorning();
      break;
  }
}

let startTxt = "( wave to begin )"
function gameStart(){
    let dots = "...".substring(3 - floor(frameCount/50) % 4);
    fill(0);
    textSize(64);
    textAlign(CENTER);
    textFont(font)
    text("a day at work"+dots, width / 2, height/2 - pad);
    if(label === "wave"){
      console.log("WAVED")
      startTxt = "waved!"
       setTimeout(() => {
       scene = 1;
    }, 5000);
    }
    textSize(32);
    fill(0,0,50,10)
    text(startTxt, width / 2, height/2 + pad);
}

let morningtxt = "welcome to work."
function goodMorning(){
  console.log("good morning")
  fill(0);
  textSize(64);
  textAlign(CENTER);
  textFont(font)
  
  setTimeout(() => {
       morningtxt = "your coworker says good morning!"
    }, 2000);
  
  text(morningtxt, width / 2, height/2 - pad);
  
}
function classifyUpdate(){
  push();
  fill(100);
  textSize(24);
  stroke(0);
  strokeWeight(4);
  textAlign(CENTER);
  textFont("Schoolbell")
  text(label, width - camw/2 -pad, height - camh);
  pop();
}
// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(video, gotResult);
}

function gotResult(results, error) {
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  if (frameCount % 2 === 0) {
     classifyVideo();
  }
  
}