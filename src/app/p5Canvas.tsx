"use client"


import React, { useRef, useEffect } from "react";
import p5, { background, noStroke, fill, circle, stroke, strokeWeight, noFill, beginShape, vertex, endShape } from "p5";
import TSNE from "tsne-js";


const data = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
];

let tSNE: any;
let embedding: Array<Array<number>>;
let mousePos: [number, number];

function setup() {
  const canvas = p5.createCanvas(400, 400);
  tSNE = new TSNE({
    dim: 2,
    perplexity: 10,
    earlyExaggeration: 4.0,
    learningRate: 100.0,
    nIter: 1000,
    metric: 'euclidean'
  });
  tSNE.init({
    data: [
      data.map(p => p.x),
      data.map(p => p.y)
    ]
  }).then(() => {
    embedding = tSNE.getOutputScaled();
  });
  canvas.parent('sketch-container');
}

function draw(p: p5) {
  if (!embedding) {
    p.background(255);
    return;
  }

  const mousePosScaled = {
    x: p.mouseX / p.width,
    y: p.mouseY / p.height
  };

  p.background(255);

  const pointRadius = 5;

  data.forEach(pt => {
    p.noStroke();
    p.fill(51);
    p.circle(pt.x * p.width, pt.y * p.height, pointRadius);
  });

  const [a, b, c, d] = embedding;

  const [ab, bc, cd] = [
    interpolate(a, b, mousePosScaled.x),
    interpolate(b, c, mousePosScaled.y),
    interpolate(c, d, mousePosScaled.x)
  ];

  const [abc, bcd] = [
    interpolate(ab, bc, mousePosScaled.y),
    interpolate(bc, cd, mousePosScaled.y)
  ];

  p.stroke(51);
  p.strokeWeight(3);
  p.noFill();
  p.beginShape();
  p.vertex(ab.x * p.width, ab.y * p.height);
  p.vertex(bc.x * p.width, bc.y * p.height);
  p.vertex(cd.x * p.width, cd.y * p.height);
  p.endShape();

  p.noStroke();
  p.fill(204);
  p.circle(abc.x * p.width, abc.y * p.height, pointRadius);

  p.noStroke();
  p.fill(204);
  p.circle(bcd.x * p.width, bcd.y * p.height, pointRadius);
}

function interpolate(a, b, t) {
  return {
    x: a.x + t * (b.x - a.x),
    y: a.y + t * (b.y - a.y)
  };
}

const sketch = new p5((p: p5) => {
  setup();
  draw(p);
}, 'sketch-container');

const P5Sketch = () => {
  return (
    <div id="sketch-container" className="mx-auto w-96 h-96"></div>
  );
};

export default P5Sketch;