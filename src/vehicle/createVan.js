import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createVan(scene, groundY) {
  const van = new THREE.Group();
  scene.add(van);

  new GLTFLoader().load(
    '/models/van.glb',
    ({ scene: model }) => {
      const bounds = new THREE.Box3().setFromObject(model);
      const center = bounds.getCenter(new THREE.Vector3());
      model.position.set(-center.x, -bounds.min.y, -center.z);
      van.add(model);
      van.position.y = groundY;
    },
    undefined,
    (error) => {
      console.error('Failed to load /models/van.glb', error);
    }
  );

  return van;
}
