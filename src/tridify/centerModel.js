import { Vector3 } from "three";
import { getIfcSlabs } from "./ifcDataHolder";

export function centerModel(arrayElements, ifc) {
  const a = [];
  arrayElements.map(x => a.push(getElements(x.object3D, getIfcSlabs(ifc))));
  const slabs = [].concat.apply([], a);
  slabs.map(x => console.log(getIdsByChildTypes(x)));
  const lowest = getLowestSlab()
  //const posList = [];
  //arrayElements.map(x => posList.push(getIdsByChildTypes(x.object3D)));
  //const a = getLenghtFromCenter(posList);
  //arrayElements.map(x => x.setAttribute("position", a));
}

function getLenghtFromCenter(arrayElements) {
  let xPos = -100000,
    yPos = -100000,
    zPos = -100000;
  let xNeg = 100000,
    yNeg = 100000,
    zNeg = 100000;
  const posList = [];
  arrayElements.map(x => x.map(y => posList.push(y)));
  posList.map(p => {
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
  const centerVector = new Vector3(-(xNeg + xPos) / 2, 0, -(zNeg + zPos) / 2);
  return centerVector;
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
