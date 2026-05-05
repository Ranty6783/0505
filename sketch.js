let capture;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設的 HTML 影片元件，只在畫布上顯示
  capture.hide();
}

function draw() {
  // 設定畫布背景顏色
  background('#e7c6ff');
  
  // 影像顯示尺寸為畫布寬高的 50%
  let imgW = width * 0.6;
  let imgH = height * 0.6;
  
  push();
  translate(width / 2, height / 2); // 移動到畫布中心
  scale(-1, 1); // 水平翻轉（左右顛倒）
  imageMode(CENTER); // 以中心點繪製影像
  image(capture, 0, 0, imgW, imgH);
  pop();
}

function windowResized() {
  // 當視窗大小改變時，重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}
