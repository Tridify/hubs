import { centerModel } from "./centerModel";
import { parseGltfUrls, parseIfc, setTridifyParams} from "./loadingCalls";

let ifcData;
const TridifyElements = [];

function checkIfModelLoaded(count, goal) {
  if (count === goal) {
    const houseMove = centerModel(TridifyElements, ifcData);  //vector to move house TODO: move camera too
    window.APP.scene.emit("tridify-scene-loaded");
    console.log("Tridify Model Loaded");
    console.log("Model moved: ", houseMove, " Offset");
  }
}

async function createModel(scene) {
  let readyCount = 0;
  await parseGltfUrls().then(model => {
    model.forEach(url => {
      const element = document.createElement("a-entity");
      element.setAttribute("gltf-model-plus", { src: url, useCache: false, inflate: true });
      element.addEventListener("model-loaded", () => {
        //console.log(`Loaded GLTF model from ${url}`);
        readyCount++;
        checkIfModelLoaded(readyCount, model.length);
      });
      element.addEventListener("model-error", () => {
        console.log(`GLTF-model from : ${url} was unable to load`);
        readyCount++;
        checkIfModelLoaded(readyCount, model.length);
      });
      TridifyElements.push(element);
      scene.appendChild(element);
    });
  });
}

function createLights(objectsScene) {
  const element = document.createElement("a-light");
  element.setAttribute("type", "ambient");
  element.setAttribute("intensity", 1.2);
  element.setAttribute("color", "#fefefa");
  objectsScene.appendChild(element);
}

export async function getTridifyModel(objectsScene) {
  setTridifyParams();
  ifcData = await parseIfc();
  createLights(objectsScene);
  await createModel(objectsScene);
}
