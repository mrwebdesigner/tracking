// @ts-nocheck
let video;
let handPose;
let hands = [];
let faceMesh;
let faces = [];
let sfasamento = 1;
let scaleFactor = 1;
let grid_rows = 20;
let grid_cols = 20;
let grid_center = createVector(width / 2, height / 2);

function preload() {
  handPose = ml5.handPose({ flipped: false });
  faceMesh = ml5.faceMesh({
    maxFaces: 1,
    refineLandmarks: false,
    flipHorizontal: false,
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handPose.detectStart(video, (results) => {
    hands = results;
  });

  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  background(0);

  // Mostra il video come texture generale dietro

  image(video, 0, 0, width, height);

  for (let i = 0; i < faces.length; i++) {
    let box = faces[i].box;
    drawUniqueVideoGridOnFace(faces[i], 5, 6);
  }

  if (hands.length > 0) {
    let hand = hands[0];
    let indexTip = hand.keypoints.find((p) => p.name === "index_finger_tip");
    if (indexTip) {
      // Mappa la coordinata X sul canvas
      sfasamento = map(indexTip.x, 0, video.width, 0.5, 2);
      scaleFactor = map(indexTip.y, 0, video.height, 2, 0.5);
      scaleFactor = constrain(scaleFactor, 0.5, 2);
    }
  }
}

function drawUniqueVideoGridOnFace(face, cols = grid_cols, rows = grid_rows) {
  const keypoints = face.keypoints;
  // Coordinate viso nel video
  let left = face.box.xMin;
  let top = face.box.yMin;

  let boxWidth = face.box.width;
  let boxHeight = face.box.height;

  let baseCellW = boxWidth / cols;
  let baseCellH = boxHeight / rows;

  let grid_center = createVector(left + boxWidth / 2, top + boxHeight / 2);


  for (let y = 0; y < grid_cols; y++) {
    for (let x = 0; x < grid_cols; x++) {

      let cx = left + grid_rows * x;
      let cy = top + baseCellH * y;

      let cella_center = createVector(cx + baseCellW / 2, cy + baseCellH / 2);
      let diff = p5.Vector.sub(cella_center, grid_center);

      let sorgente_center = grid_center.add(diff.mult(sfasamento));
      let sx = sorgente_center.x - baseCellW / 2;
      let sy = sorgente_center.y - baseCellH / 2;

      let cell_w = width / grid_cols;
      let cell_h = height / grid_rows;
      let cell_x = i * cell_w;
      let cell_y = j * cell_h;

      let cell_center = createVector(cell_x + cell_w / 2, cell_y + cell_h / 2);
      
      let diff = p5.Vector.sub(cell_center, grid_center)
      let m = map(mouseX, 0, width, 0.5, 1.5)
      let source_center = p5.Vector.add(grid_center, diff.mult(m))
      
      let source_x = source_center.x - cell_w/2
      let source_y = source_center.y - cell_h/2

      copy(
        video,
        sx,
        sy,
        baseCellW,
        baseCellH,
        cx,
        cy,
        baseCellW,
        baseCellH
        source_x,
        source_y,
        cell_w,
        cell_h,
        cell_x,
        cell_y,
        cell_w,
        cell_h
      );
    }
  }
}

function gotFaces(results) {
  faces = results;
}
