import { Vector3 } from "three";

export function setMainCameraPositon(vectors) {
  getCameraRadiusToModel(vectors);
}

function getCameraRadiusToModel(vectors) {
  const camEntity = document.getElementById("viewing-rig");
  const cam = document.getElementById("viewing-camera");
  const modelSize =
    vectors[0].x - vectors[1].x > vectors[0].z - vectors[1].z
      ? vectors[0].x - vectors[1].x
      : vectors[0].z - vectors[1].z;
  const d = modelSize / 1.5;
  const vec = new Vector3(d, (Math.abs(vectors[0].y) + Math.abs(vectors[1].y)) * 2, -d);
  camEntity.setAttribute("position", vec);
  camEntity.object3D.lookAt(new Vector3(0, 0, 0));
  cam.object3D.lookAt(new Vector3(0, 0, 0));
  cam.object3D.rotation.y -= Math.PI;
}
