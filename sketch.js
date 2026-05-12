let capture;
let facemesh;
let predictions = [];
let videoReady = false;

// 耳朵附近 landmark
const LEFT_EAR = 234;
const RIGHT_EAR = 454;

function setup() {
  createCanvas(windowWidth, windowHeight);

  capture = createCapture(VIDEO, () => {
    videoReady = true;
  });

  capture.size(640, 480);
  capture.hide();

  facemesh = ml5.facemesh(capture, () => {
    console.log("FaceMesh Ready");
  });

  facemesh.on("predict", results => {
    predictions = results;
  });

  ellipseMode(CENTER);
  imageMode(CENTER);
}

function draw() {
  background("#e7c6ff");

  let imgW = width * 0.5;
  let imgH = height * 0.5;

  // 上方文字
  fill(0);
  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  text("教科414730852", width / 2, (height - imgH) / 4);

  if (!videoReady) return;

  // 畫鏡像攝影機
  push();
  translate(width / 2, height / 2);
  scale(-1, 1);

  image(capture, 0, 0, imgW, imgH);

  // 畫耳環
  drawEarrings(imgW, imgH);

  pop();
}

function drawEarrings(imgW, imgH) {
  if (predictions.length === 0) return;

  let keypoints = predictions[0].scaledMesh;

  let leftEar = keypoints[LEFT_EAR];
  let rightEar = keypoints[RIGHT_EAR];

  drawSingleEarring(leftEar, imgW, imgH);
  drawSingleEarring(rightEar, imgW, imgH);
}

function drawSingleEarring(point, imgW, imgH) {
  if (!point) return;

  let x = map(point[0], 0, capture.width, -imgW / 2, imgW / 2);
  let y = map(point[1], 0, capture.height, -imgH / 2, imgH / 2);

  // 往下偏移，避免卡進耳朵
  y += 10;

  let size = max(width, height) * 0.012;
  let spacing = size * 1.8;

  noStroke();

  // 耳釘
  fill(255);
  ellipse(x, y, size * 0.5);

  // 三顆耳環珠珠
  for (let i = 0; i < 3; i++) {
    fill(255, 220 - i * 30, 0);
    ellipse(x, y + (i + 1) * spacing, size);
  }

  // 小連接線
  stroke(255);
  strokeWeight(2);

  for (let i = 0; i < 3; i++) {
    line(
      x,
      y + (i * spacing),
      x,
      y + ((i + 1) * spacing)
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
