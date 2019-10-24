export function getIfcSlabs(ifc) {
  return getIds(ifc, "IfcSlabType");
}

function getIds(ifcObject, type, accumulator = []) {
  if (ifcObject.hasOwnProperty("@id") && Object.keys(ifcObject).includes(type)) {
    accumulator.push(ifcObject["@id"]);
  }
  const childObjects = Object.values(ifcObject).filter(x => typeof x === "object");
  childObjects.forEach(x => getIds(x, type, accumulator));
  return accumulator;
}
