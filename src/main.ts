import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xbfe3dd );

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set( 8, -4, -4);
const renderer = new THREE.WebGLRenderer();
console.log(document.getElementById('app'))
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app')?.appendChild(renderer.domElement)

camera.position.set(0,1,-2)
camera.lookAt(0,0,0)
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 2, 2, 22 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;
let meshesWithMaterial = new Map()

function animate() {
    requestAnimationFrame(animate)
    controls.update();
    renderer.render(scene, camera)
}
animate()
const light = new THREE.HemisphereLight(0xffffff, 2);
light.position.set(2, 0, 0);
scene.add(light);
let INTERSECTED = null;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = - (event.clientY / window.innerHeight) * 2 + 1;
    mouse.set(x, y);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if ( intersects.length > 0 ) {
        console.log(intersects[0])
        if ( INTERSECTED != intersects[ 0 ].object ) {
            console.log('new')
            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff7777 );

            scene.traverse((object) => {
                if (object.isMesh && object.material) {
                    if (object.material.id === INTERSECTED.material.id) {
                        meshesWithMaterial.set(object.name, object.id)
                    }
                }
            });
        }
        console.log('same')
    } else {
        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
    }
});

const loader = new GLTFLoader()
// loader.setResourcePath('draco/tex/')
loader.load('3.glb', function (gltf) {
    console.log('loaded', gltf)
    const model = gltf.scene;
    model.traverse((node) => {
        if (node.isMesh) {
        }
    });

    scene.add(gltf.scene)
}, undefined, (err) => {
    console.error(err)
})

