import { Vector3 } from "three";
import { getIfcSlabs } from "./ifcDataHolder";
import { setMainCameraPositon } from "./setCamera";

export function centerModel(arrayElements, ifc) {
  const slabsData = getIfcSlabs(ifc);
  if (!slabsData) console.log("no slabs found");

  const slabGroups = arrayElements
    .map(x => {
      return getElements(x.object3D, slabsData);
    })
    .filter(x => x.length > 0)
    .flat();

  const slabsPos = slabGroups
    .map(x => {
      return getIdsByChildTypes(x);
    })
    .filter(x => x.length > 0)
    .flat();

  const vectors = getLenghtFromCenter(
    arrayElements
      .map(x => {
        return getIdsByChildTypes(x.object3D);
      })
      .filter(x => x.length > 0)
      .flat(),
    getLowestSlab(slabsPos)
  );
  setMainCameraPositon(vectors);
  const moveVector = createVectorToMove(vectors);

  arrayElements.forEach(x => x.setAttribute("position", moveVector));
  return moveVector;
}
function getLowestSlab(slabsPos) {
  let a = 100000;
  slabsPos.forEach(x => {
    if (a > x.y) {
      a = x.y;
    }
  });
  return a;
}
function createVectorToMove(vectors, yPosition) {
  const posVector = vectors[0];
  const negVector = vectors[1];
  const centerVector = new Vector3(-(negVector.x + posVector.x) / 2, -yPosition, -(negVector.z + posVector.z) / 2);
  return centerVector;
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
  //return [xPos, yPos, zPos, xNeg, yNeg, zNeg];
}

function getIdsByChildTypes(ifcObject, accumulator = []) {
  if (ifcObject.hasOwnProperty("children") && ifcObject["type"] == "Mesh") {
    accumulator.push(ifcObject.getWorldPosition());
  }
  if (!isEmpty(ifcObject["children"])) {
    ifcObject.children.forEach(x => getIdsByChildTypes(x, accumulator));
  }
  return accumulator;
}

function isEmpty(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

function getElements(ifcObject, childHashIds, accumulator = []) {
  if (
    ifcObject["type"] == "Group" &&
    ifcObject.hasOwnProperty("name") &&
    Object.values(ifcObject).some(y => childHashIds.includes(y))
  ) {
    accumulator.push(ifcObject);
  }
  if (!isEmpty(ifcObject["children"])) {
    ifcObject.children.forEach(x => getElements(x, childHashIds, accumulator));
  }
  return accumulator;
}
