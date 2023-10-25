import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xbfe3dd );

const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set( 8, -4, -4);
const renderer = new THREE.WebGLRenderer();
console.log(document.getElementById('app'))
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app')?.appendChild(renderer.domElement)


const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

function animate() {
    requestAnimationFrame(animate)
    controls.update();
    renderer.render(scene, camera)
}
animate()
const light = new THREE.PointLight(0xb75301, 1);
light.position.set(1, 0, 0);
scene.add(light);
camera.lookAt(0,0,30)

const loader = new GLTFLoader()
loader.setResourcePath('draco/text/')
loader.load('1.glb', function (gltf) {
    console.log('loaded', gltf)
    const model = gltf.scene;
    const debugMaterial = new THREE.MeshNormalMaterial();
    model.traverse((node) => {
        if (node.isMesh) {
            node.material = debugMaterial;
            node.geometry.computeVertexNormals();
        }
    });

    scene.add(gltf.scene)
}, undefined, (err) => {
    console.error(err)
})

