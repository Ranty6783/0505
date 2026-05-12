let capture;

let facemesh;
let predictions = [];

let handpose;
let hands = [];

let videoReady = false;

// 耳朵 landmark
const LEFT_EAR = 234;
const RIGHT_EAR = 454;

// 耳環圖片
let earrings = [];
let currentEarring;

// =========================
// 載入圖片
// =========================
function preload() {
  earrings[1] = loadImage("picture/acc/acc1_ring.png");
  earrings[2] = loadImage("picture/acc/acc2_pearl.png");
  earrings[3] = loadImage("picture/acc/acc3_tassel.png");
  earrings[4] = loadImage("picture/acc/acc4_jade.png");
  earrings[5] = loadImage("picture/acc/acc5_phoenix.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  capture = createCapture(VIDEO, () => {
    videoReady = true;
  });

  capture.size(640, 480);
  capture.hide();

  // FaceMesh
  facemesh = ml5.facemesh(capture, () => {
    console.log("FaceMesh Ready");
  });

  facemesh.on("predict", results => {
    predictions = results;
  });

  // HandPose
  handpose = ml5.handpose(capture, () => {
    console.log("HandPose Ready");
  });

  handpose.on("predict", results => {
    hands = results;
  });

  // 預設耳環
  currentEarring = earrings[1];

  imageMode(CENTER);
}

function draw() {
  background("#e7c6ff");

  let imgW = width * 0.5;
  let imgH = height * 0.5;

  // 標題
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(32);
  text("教科414730852", width / 2, (height - imgH) / 4);

  if (!videoReady) return;

  // 更新手勢
  detectGesture();

  push();

  translate(width / 2, height / 2);

  // 鏡像
  scale(-1, 1);

  image(capture, 0, 0, imgW, imgH);

  drawEarrings(imgW, imgH);

  pop();
}

// =========================
// 手勢辨識
// =========================
function detectGesture() {
  if (hands.length === 0) return;

  let hand = hands[0];
  let landmarks = hand.landmarks;

  let fingers = 0;

  // 拇指
  if (landmarks[4][0] < landmarks[3][0]) {
    fingers++;
  }

  // 食指
  if (landmarks[8][1] < landmarks[6][1]) {
    fingers++;
  }

  // 中指
  if (landmarks[12][1] < landmarks[10][1]) {
    fingers++;
  }

  // 無名指
  if (landmarks[16][1] < landmarks[14][1]) {
    fingers++;
  }

  // 小指
  if (landmarks[20][1] < landmarks[18][1]) {
    fingers++;
  }

  fingers = constrain(fingers, 1, 5);

  currentEarring = earrings[fingers];
}

// =========================
// 畫耳環
// =========================
function drawEarrings(imgW, imgH) {
  if (predictions.length === 0) return;

  let keypoints = predictions[0].scaledMesh;

  let leftEar = keypoints[234];
  let rightEar = keypoints[454];

  drawSingleEarring(leftEar, true, imgW, imgH);
  drawSingleEarring(rightEar, false, imgW, imgH);
}

function drawSingleEarring(point, isLeft, imgW, imgH) {
  if (!point) return;

  // 基本位置
  let x = map(
    point[0],
    0,
    capture.width,
    -imgW / 2,
    imgW / 2
  );

  let y = map(
    point[1],
    0,
    capture.height,
    -imgH / 2,
    imgH / 2
  );

  // =========================
  // 修正耳環位置
  // 更靠近耳垂與臉頰
  // =========================

  if (isLeft) {
    x += 18;
  } else {
    x -= 18;
  }

  y += 28;

  // 耳環大小
  let earringSize = imgW * 0.12;

  push();

  translate(x, y);

  // 因為整體畫面鏡像
  scale(-1, 1);

  image(
    currentEarring,
    0,
    0,
    earringSize,
    earringSize
  );

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}