import { Vector3, Vector2 } from "three";

export function centerModel(arrayElements) {
  console.log(arrayElements);
  getLenghtFromCenter(arrayElements);
}

function getLenghtFromCenter(arrayElements) {
  let xPos = -100000,
    yPos = -100000,
    zPos = -100000;
  let xNeg = 100000,
    yNeg = 100000,
    zNeg = 100000;
  posList = [];
  arrayElements.map(x => posList.push(x.pos));
  posList.map(p => {
    if (p.x > xPos) {
      xPos = p.pos.x;
    }
    if (p.pos.y > yPos) {
      yPos = p.pos.y;
    }
    if (p.pos.z > zPos) {
      zPos = p.pos.z;
    }

    if (p.pos.x < xNeg) {
      xNeg = p.pos.x;
    }
    if (p.pos.y < yNeg) {
      yNeg = p.pos.y;
    }
    if (p.pos.z < zNeg) {
      zNeg = p.pos.z;
    }
  });
  const vecNeg = new Vector3(xNeg, yNeg, zNeg);
  const vecPos = new Vector3(xPos, yPos, zPos);
  const centerVector = new Vector3((vecNeg.x + vecPos.x) / 2, (vecNeg.y + vecPos.y) / 2, (vecNeg.z + vecPos.z) / 2);
  return null;
}

function distanceVector(v1, v2) {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  const dz = v1.z - v2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
