// @ts-nocheck
let video;
let handPose;
let hands = [];
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };
let sfasamento = 10;
let scaleFactor = 1; // Fattore di scala

function preload() {
  handPose = ml5.handPose({ flipped: false });
  faceMesh = ml5.faceMesh(options);
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
  image(video, 0, 0, width, height);

  if (hands.length > 0) {
    let hand = hands[0];
    let indexTip = hand.keypoints.find((p) => p.name === "index_finger_tip");
    if (indexTip) {
      // Mappa X su sfasamento (0–100)
      sfasamento = map(indexTip.x, 0, video.width, 0, 100);
      // Mappa Y su scala (es. da 0.5 a 2)
      scaleFactor = map(indexTip.y, 0, video.height, 2, 0.5);
      scaleFactor = constrain(scaleFactor, 0.5, 2);
    }
  }

  for (let i = 0; i < faces.length; i++) {
    drawUniqueVideoGridOnFace(faces[i], 5, 6);
  }
}

function drawUniqueVideoGridOnFace(face, cols = 5, rows = 6) {
  let left = face.box.xMin;
  let top = face.box.yMin;
  let boxWidth = face.box.width;
  let boxHeight = face.box.height;

  let baseCellW = boxWidth / cols;
  let baseCellH = boxHeight / rows;

  let cellW = baseCellW * scaleFactor;
  let cellH = baseCellH * scaleFactor;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cx = left + baseCellW * x;
      let cy = top + baseCellH * y;

      // Allinea il copy rispetto alla nuova dimensione
      copy(
        video,
        cx - x * sfasamento,
        cy - y * sfasamento,
        cellW,
        cellH,
        cx - cellW / 2 + baseCellW / 2,
        cy - cellH / 2 + baseCellH / 2,
        cellW,
        cellH
      );
    }
  }
}

function gotFaces(results) {
  faces = results;
}
