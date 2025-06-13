// @ts-nocheck
let video;
let handPose;
let hands = [];
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

let rotationAngle = 0;

function preload() {
  handPose = ml5.handPose({ flipped: false });
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

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
  //rotationAngle += 0.01;

  // Mostra il video come texture generale dietro
  push();
  translate(-width / 2, -height / 2);
  image(video, 0, 0, width, height);
  pop();

  // Disegna griglia rotante sopra al volto
  for (let i = 0; i < faces.length; i++) {
    let box = faces[i].box;
    drawUniqueVideoGridOnFace(faces[i], 5, 6);
  }
}

function drawUniqueVideoGridOnFace(face, cols = 5, rows = 6) {
  const keypoints = face.keypoints;
  // Coordinate viso nel video
  let left = keypoints[234].x;
  let right = keypoints[454].x;
  let top = keypoints[10].y;
  let bottom = keypoints[152].y;

  let boxWidth = right - left;
  let boxHeight = bottom - top;

  let cellW = boxWidth / cols;
  let cellH = boxHeight / rows;

  texture(video);
  noStroke();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Coordinate su video
      let u0 = (left + x * cellW) / video.width;
      let v0 = (top + y * cellH) / video.height;
      let u1 = (left + (x + 1) * cellW) / video.width;
      let v1 = (top + (y + 1) * cellH) / video.height;

      // Coordinate su canvas WebGL
      let cx = left + x * cellW - width / 2;
      let cy = top + y * cellH - height / 2;

      push();
      translate(cx + cellW / 2, cy + cellH / 2, 0);
      rotateY(rotationAngle * sin(x + y + frameCount * 0.05));

      beginShape();
      texture(video);

      vertex(-cellW / 2, -cellH / 2, 0, u0, v0);
      vertex(cellW / 2, -cellH / 2, 0, u1, v0);
      vertex(cellW / 2, cellH / 2, 0, u1, v1);
      vertex(-cellW / 2, cellH / 2, 0, u0, v1);

      endShape(CLOSE);
      pop();
    }
  }
}

function gotFaces(results) {
  faces = results;
}

//let rotazione = 0;

// Calcola rotazione in base alla distanza dita mano 1
//if (hands[0]) {
//let pollice = hands[0].keypoints[4];
//let indice = hands[0].keypoints[8];
//let d = dist(pollice.x, pollice.y, indice.x, indice.y);
//rotazione = map(d, 0, 150, 0, PI); // rotazione Y
//}

// Disegna griglia di celle che ruotano
//function drawFaceGridWithRotation(box, rotazione) {
//let cols = 4;
//let rows = 4;
//let cellW = box.width / cols;
//let cellH = box.height / rows;

//for (let y = 0; y < rows; y++) {
//for (let x = 0; x < cols; x++) {
//let px = box.xMin + x * cellW;
//let py = box.yMin + y * cellH;

//let cx = px + cellW / 2 - width / 2;
//let cy = py + cellH / 2 - height / 2;

//push();
//translate(cx, cy, 0);

// Rotazione Y dinamica per ogni cella
//let localPhase = sin(x + y + frameCount * 0.05);
//rotateY(rotazione * localPhase);

//}
//}
//}
