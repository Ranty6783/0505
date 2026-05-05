let capture;
let facemesh;
let predictions = [];
let videoReady = false;

// 第一條（紅 粗15）
const lineSet1 = [
  409,270,269,267,0,37,39,40,185,
  61,146,91,181,84,17,314,405,321,375,291
];

// 第二條（紅 粗1）
const lineSet2 = [
  76,77,90,180,85,16,315,404,320,307,
  306,408,304,303,302,11,72,73,74,184
];

// 右眼
const rightEyeOuter = [33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246];
const rightEyeInner = [247,30,29,27,28,56,190,243];

// 左眼
const leftEyeOuter = [362,382,381,380,374,373,390,249,263,466,388,387,386,385,384,398];
const leftEyeInner = [467,260,259,257,258,286,414,463];

// 臉部外框
const faceOutline = [
  10,338,297,332,284,251,389,356,454,323,361,288,
  397,365,379,378,400,377,152,148,176,149,150,136,
  172,58,132,93,234,127,162,21,54,103,67,109
];

function setup() {
  createCanvas(windowWidth, windowHeight);

  capture = createCapture(VIDEO, () => {
    videoReady = true;
  });
  capture.size(640, 480);
  capture.hide();

  facemesh = ml5.facemesh(capture, () => {
    console.log("facemesh ready");
  });

  facemesh.on("predict", results => {
    predictions = results;
  });
}

function draw() {
  background('#e7c6ff');

  let imgW = width * 0.5;
  let imgH = height * 0.5;

  // 上方文字（不在影像上）
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("教科414730852", width / 2, (height - imgH) / 4);

  if (!videoReady) return;

  push();
  translate(width / 2, height / 2);
  scale(-1, 1);
  imageMode(CENTER);
  image(capture, 0, 0, imgW, imgH);

  drawAllMesh(imgW, imgH);

  pop();
}

function drawAllMesh(imgW, imgH) {
  if (predictions.length === 0) return;

  let keypoints = predictions[0].scaledMesh;

  // 第一條 粗15
  stroke(255, 0, 0);
  strokeWeight(15);
  noFill();
  drawShape(lineSet1, keypoints, imgW, imgH);

  // 第二條 粗1
  strokeWeight(1);
  drawShape(lineSet2, keypoints, imgW, imgH);

  // 嘴唇（保留）
  strokeWeight(1);
  drawShape(lineSet1, keypoints, imgW, imgH);

  // 右眼 外圈
  strokeWeight(1);
  drawShape(rightEyeOuter, keypoints, imgW, imgH);

  // 右眼 內圈
  drawShape(rightEyeInner, keypoints, imgW, imgH);

  // 左眼 外圈
  drawShape(leftEyeOuter, keypoints, imgW, imgH);

  // 左眼 內圈
  drawShape(leftEyeInner, keypoints, imgW, imgH);

  // 臉部外框（藍色 粗2）
  stroke(0, 0, 255);
  strokeWeight(2);
  drawShape(faceOutline, keypoints, imgW, imgH);
}

function drawShape(indexArray, keypoints, imgW, imgH) {
  beginShape();
  for (let i = 0; i < indexArray.length; i++) {
    let idx = indexArray[i];
    if (keypoints[idx]) {
      let x = map(keypoints[idx][0], 0, capture.width, -imgW/2, imgW/2);
      let y = map(keypoints[idx][1], 0, capture.height, -imgH/2, imgH/2);
      vertex(x, y);
    }
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}