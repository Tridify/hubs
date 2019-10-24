import { getModelHash } from "./modelparams";

const defaultUrl = "iyN_Ip9hznKe0DVpD8uACqq-SuVaI0pzc33UkpbwzRE";
const baseUrl = "https://ws.tridify.com/api/shared/conversion";
let urlParams;
const myUrl = () => `${baseUrl}/${urlParams || defaultUrl}`;

export function setTridifyParams() {
    urlParams = getModelHash();
    console.log("Saved model hash: " + urlParams);
}

export const parseIfc = () => {
    return fetch(myUrl() + "/ifc")
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        return myJson.ifc.decomposition;
      })
      .then(function(deco) {
        return deco.IfcProject.IfcSite.IfcBuilding.IfcBuildingStorey;
      });
  };

export const parseGltfUrls = () => {
  return fetch(myUrl())
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      return myJson.ColladaUrls.filter(item => item.includes(".gltf")).filter(item => !item.includes("IfcSpace"));
    });
};