import { getModelHash } from "./modelparams";

let urlParams;

export function setTridifyParams() {
  urlParams = getModelHash();
  console.log("Saved model hash: " + urlParams);
}

const defaultUrl = "iyN_Ip9hznKe0DVpD8uACqq-SuVaI0pzc33UkpbwzRE";
const baseUrl = "https://ws.tridify.com/api/shared/conversion";
const myUrl = () => `${baseUrl}/${urlParams || defaultUrl}`;
export let ifcData = [];
export const navMeshes = [];
export let singleGeometry;
const parseGltfUrls = () => {
  return fetch(myUrl())
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      return myJson.ColladaUrls.filter(item => item.includes(".gltf")).filter(item => !item.includes("IfcSpace"));
    });
};

function checkIfModelLoaded(scene, count, goal) {
  if (count === goal) {
    window.APP.scene.emit("tridify-scene-loaded");
    console.log("Tridify Model Loaded");
    createNavMesh(scene);
  }
}

async function createModel(scene) {
  let readyCount = 0;

  parseGltfUrls().then(model => {
    model.forEach(url => {
      const element = document.createElement("a-entity");
      element.setAttribute("gltf-model-plus", { src: url, useCache: false, inflate: true });
      element.addEventListener("model-loaded", () => {
        readyCount++;
        checkIfModelLoaded(scene, readyCount, model.length);
      });
      element.addEventListener("model-error", () => {
        readyCount++;
        checkIfModelLoaded(scene, readyCount, model.length);
      });

      scene.appendChild(element);
    });
  });
}

function createLights(objectsScene) {
  const element = document.createElement("a-light");
  element.setAttribute("type", "ambient");
  objectsScene.appendChild(element);
}

export async function getTridifyModel(objectsScene) {
  setTridifyParams();
  const ifcSlabs = await parseIfc().then(ifc => {
    return getObjectsWithName(["IfcSlab"], "ifc", ifc);
  });
  const flatIfcSlabs = ifcSlabs.flatMap(x => (Array.isArray(x) ? x : [x]));
  ifcData = flatIfcSlabs.filter(x => x["@id"]).map(x => x["@id"]);
  createLights(objectsScene);
  await createModel(objectsScene);
}

const parseIfc = () => {
  return fetch(myUrl() + "/ifc")
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      return myJson.ifc.decomposition;
    })
    .then(function(deco) {
      return deco;
    });
};
function createNavMesh(enviroment) {
  if (navMeshes.length > 0) {
    console.log(navMeshes.length);
    const buffgeo = new THREE.Geometry();
    for (let i = 0; i < navMeshes.length; i++) {
      buffgeo.merge(new THREE.Geometry().fromBufferGeometry(navMeshes[i]));
    }
    buffgeo.mergeVertices();
    buffgeo.computeVertexNormals();
    const mesh = new THREE.Mesh(buffgeo);
    mesh.updateMatrix();
    singleGeometry = new THREE.BufferGeometry().fromGeometry(mesh.geometry);
    singleGeometry.computeVertexNormals();
  } else {
    console.log("ifc slabs not found");
  }
  createMesh(enviroment);
}
function createMesh(scene) {
  if (navMeshes.length > 0) {
    const element = document.createElement("a-entity");
    element.setAttribute("gltf-model-plus", { src: "./src/tridify/defaultNav.gltf", useCache: false, inflate: true });
    scene.appendChild(element);
  } else {
    console.log("There is no geometry for navmesh");
  }
}

function getObjectsWithName(targetNames, myName, myObject) {
  const arr = targetNames.includes(myName) ? [myObject] : [];
  const entryObjs = Object.entries(myObject).filter(x => typeof x[1] === "object");
  const children = entryObjs.flatMap(x => getObjectsWithName(targetNames, x[0], x[1]));
  return arr.concat(children);
}
