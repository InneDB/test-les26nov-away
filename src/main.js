import * as THREE from 'three';
import { createScene } from './scene/createScene.js';
import { createVanController } from './controls/createVanController.js';
import { createVan } from './vehicle/createVan.js';

const { scene, camera, renderer, ground } = createScene();
const van = createVan(scene, ground.position.y);
const vanController = createVanController(van, camera);
const clock = new THREE.Clock();

function animate() {
  vanController.update(Math.min(clock.getDelta(), 0.05));
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
