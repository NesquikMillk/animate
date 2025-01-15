import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Инициализация сцены, камеры и рендера
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Освещение
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // мягкий свет
scene.add(ambientLight);

// Управление камерой
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1.5, 5);
controls.update();

// Загрузка модели
const loader = new GLTFLoader();
loader.load(
  './assets/model.glb', // Замените на путь к вашей модели
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Настройка анимации
    const mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });

    // Анимационный цикл
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      mixer.update(clock.getDelta());
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  },
  undefined,
  (error) => {
    console.error('Произошла ошибка при загрузке модели:', error);
  }
);

// Обработка изменения размера окна
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
