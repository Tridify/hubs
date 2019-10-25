import { Vector3 } from "three";
import { getIfcSlabs } from "./ifcDataHolder";
import { setMainCameraPositon } from "./setCamera";

export function centerModel(arrayElements, ifc) {
  const slabsData = getIfcSlabs(ifc);
  if (!slabsData) console.log("no slabs found");

  const allGroups = arrayElements
    .map(x => {
      return getGroupEntities(x.object3D);
    })
    .filter(x => x.length > 0)
    .flat();
  const slabGroups = allGroups.filter(x => slabsData.includes(x.name));
  const slabsPos = getAndSortMeshes(slabGroups);
  const allMeshesPos = getAndSortMeshes(allGroups);
  const vectors = getLenghtFromCenter(allMeshesPos);
  const vDist = dist(vectors[0], vectors[1]);

  setMainCameraPositon(vDist);
  const moveVector = createVectorToMove(vectors, slabsPos[0] ? slabsPos[0].y : 0);

  arrayElements.forEach(x => x.setAttribute("position", moveVector));
  return moveVector;
}
function dist(vector1, vector2) {
  const a = vector1.x - vector2.x;
  const b = vector1.y - vector2.y;
  const c = vector1.z - vector2.z;
  return Math.sqrt(a * a + b * b + c * c);
}
function getAndSortMeshes(groupMeshes) {
  return groupMeshes
    .map(x => {
      return getChildMeshesPosition(x);
    })
    .filter(x => x.length > 0)
    .flat()
    .sort((a, b) => {
      return a.y - b.y;
    });
}

function createVectorToMove(vectors, yPosition) {
  return new Vector3(-(vectors[1].x + vectors[0].x) / 2, -yPosition, -(vectors[1].z + vectors[0].z) / 2);
}

function getLenghtFromCenter(arrayElements) {
  let xPos = -100000,
    yPos = -100000,
    zPos = -100000;
  let xNeg = 100000,
    yNeg = 100000,
    zNeg = 100000;

  arrayElements.forEach(p => {
    if (p.x > xPos) {
      xPos = p.x;
    }
    if (p.y > yPos) {
      yPos = p.y;
    }
    if (p.z > zPos) {
      zPos = p.z;
    }
    if (p.x < xNeg) {
      xNeg = p.x;
    }
    if (p.y < yNeg) {
      yNeg = p.y;
    }
    if (p.z < zNeg) {
      zNeg = p.z;
    }
  });
  return [{ x: xPos, y: yPos, z: zPos }, { x: xNeg, y: yNeg, z: zNeg }];
}

function getChildMeshesPosition(ifcObject, accumulator = []) {
  if (ifcObject.hasOwnProperty("children") && ifcObject["type"] == "Mesh") {
    accumulator.push(ifcObject.getWorldPosition());
  }
  if (!isEmpty(ifcObject["children"])) {
    ifcObject.children.forEach(x => getChildMeshesPosition(x, accumulator));
  }
  return accumulator;
}
function getGroupEntities(ifcObject, accumulator = []) {
  if (ifcObject["type"] == "Group" && ifcObject.hasOwnProperty("name") && ifcObject["name"] != "") {
    accumulator.push(ifcObject);
  }
  if (!isEmpty(ifcObject["children"])) {
    ifcObject.children.forEach(x => getGroupEntities(x, accumulator));
  }
  return accumulator;
}
function isEmpty(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
