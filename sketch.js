let capture;
let facemesh;
let predictions = [];

const connectIndex = [
  409, 270, 269, 267, 0, 37, 39, 40, 185,
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291
];

function setup() {
  createCanvas(windowWidth, windowHeight);

  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  facemesh = ml5.facemesh(capture, () => {
    console.log("facemesh ready");
  });

  facemesh.on("predict", (results) => {
    predictions = results;
  });
}

function draw() {
  background('#e7c6ff');

  let imgW = width * 0.6;
  let imgH = height * 0.6;

  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("教科414730852", width / 2, (height - imgH) / 4);

  push();
  translate(width / 2, height / 2);
  scale(-1, 1);
  imageMode(CENTER);
  image(capture, 0, 0, imgW, imgH);

  drawFaceMesh(imgW, imgH);
  pop();
}

function drawFaceMesh(imgW, imgH) {
  if (predictions.length === 0) return;

  let face = predictions[0];
  let keypoints = face.scaledMesh;

  stroke(255, 0, 0);
  strokeWeight(15);
  noFill();

  beginShape();
  for (let i = 0; i < connectIndex.length; i++) {
    let idx = connectIndex[i];

    if (keypoints[idx]) {
      let x = map(keypoints[idx][0], 0, capture.width, -imgW / 2, imgW / 2);
      let y = map(keypoints[idx][1], 0, capture.height, -imgH / 2, imgH / 2);
      vertex(x, y);
    }
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}