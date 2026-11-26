import * as THREE from 'three';

const movementKeys = new Set([
  'KeyZ',
  'KeyS',
  'KeyQ',
  'KeyD',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
]);

export function createVanController(van, camera) {
  const pressedKeys = new Set();
  const cameraOffset = new THREE.Vector3(0, 4, -7);
  const cameraTarget = new THREE.Vector3();
  const desiredCameraPosition = new THREE.Vector3();
  let speed = 0;

  window.addEventListener('keydown', (event) => {
    if (movementKeys.has(event.code)) {
      event.preventDefault();
      pressedKeys.add(event.code);
    }
  });

  window.addEventListener('keyup', (event) => {
    pressedKeys.delete(event.code);
  });

  window.addEventListener('blur', () => {
    pressedKeys.clear();
  });

  function update(delta) {
    const throttle =
      Number(pressedKeys.has('KeyZ') || pressedKeys.has('ArrowUp')) -
      Number(pressedKeys.has('KeyS') || pressedKeys.has('ArrowDown'));
    const steering =
      Number(pressedKeys.has('KeyD') || pressedKeys.has('ArrowRight')) -
      Number(pressedKeys.has('KeyQ') || pressedKeys.has('ArrowLeft'));

    speed += throttle * 12 * delta;
    speed = THREE.MathUtils.clamp(speed, -4, 9);
    if (throttle === 0) {
      speed *= Math.exp(-3 * delta);
      if (Math.abs(speed) < 0.02) speed = 0;
    }

    if (speed !== 0) {
      van.rotation.y += steering * Math.sign(speed) * 1.8 * delta;
      van.position.x += Math.sin(van.rotation.y) * speed * delta;
      van.position.z += Math.cos(van.rotation.y) * speed * delta;
      van.position.x = THREE.MathUtils.clamp(van.position.x, -95, 95);
      van.position.z = THREE.MathUtils.clamp(van.position.z, -95, 95);
    }

    desiredCameraPosition
      .copy(cameraOffset)
      .applyQuaternion(van.quaternion)
      .add(van.position);
    camera.position.lerp(desiredCameraPosition, 1 - Math.exp(-5 * delta));
    cameraTarget.copy(van.position).add(new THREE.Vector3(0, 1, 0));
    camera.lookAt(cameraTarget);
  }

  return { update };
}
