import { Vector3 } from "three";

export function setMainCameraPositon(d) {
  getCameraRadiusToModel(d);
}

function getCameraRadiusToModel(d) {
  const camEntity = document.getElementById("viewing-rig");
  const cam = document.getElementById("viewing-camera");
  const vec = new Vector3(d, d / 2, -d);
  camEntity.setAttribute("position", vec);
  camEntity.object3D.lookAt(new Vector3(0, 0, 0));
  cam.object3D.lookAt(new Vector3(0, 0, 0));
  cam.object3D.rotation.y -= Math.PI;
}
