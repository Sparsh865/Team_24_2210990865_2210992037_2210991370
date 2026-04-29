import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

class DigitalTwinStudio {
    constructor() {
        this.container = document.getElementById('viewport');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf1f3f5);
        
        this.clock = new THREE.Clock();
        this.isRotating = true;
        this.rotationSpeed = 0.28; // Subtle, smooth motion

        this.init();
        this.setupLights();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 3000);
        this.camera.position.set(15, 15, 15);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;
        this.container.appendChild(this.renderer.domElement);

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enableDamping = true;
        this.orbit.dampingFactor = 0.08;

        this.transform = new TransformControls(this.camera, this.renderer.domElement);
        this.scene.add(this.transform);

        this.transform.addEventListener('dragging-changed', (e) => {
            this.orbit.enabled = !e.value;
        });

        window.addEventListener('resize', () => this.onResize());
    }

    setupEventListeners() {
        // Play/Stop Rotation
        const rotBtn = document.getElementById('rotate-toggle');
        rotBtn.onclick = () => {
            this.isRotating = !this.isRotating;
            rotBtn.innerText = this.isRotating ? "STOP MOTION" : "PLAY MOTION";
            rotBtn.classList.toggle('stopped', !this.isRotating);
        };

        // Zoom Logic: Moves camera percentage-wise toward center
        document.getElementById('zoom-in').onclick = () => this.triggerZoom(0.85);
        document.getElementById('zoom-out').onclick = () => this.triggerZoom(1.15);
    }

    triggerZoom(factor) {
        this.camera.position.multiplyScalar(factor);
        this.orbit.update();
    }

    setupLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 1.3);
        this.scene.add(ambient);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
        keyLight.position.set(10, 25, 15);
        this.scene.add(keyLight);

        const fillLight = new THREE.PointLight(0xffffff, 0.6);
        fillLight.position.set(-15, 10, -10);
        this.scene.add(fillLight);
    }

    loadModel(path) {
        new GLTFLoader().load(path, (gltf) => {
            this.model = gltf.scene;

            // Vibrant Multi-Part Material Strategy
            const palette = [0x3182ce, 0x718096, 0x2d3748, 0xa0aec0, 0x4299e1];
            let meshCount = 0;

            this.model.traverse(node => {
                if (node.isMesh) {
                    node.material = new THREE.MeshStandardMaterial({
                        color: palette[meshCount % palette.length],
                        metalness: 0.65,
                        roughness: 0.25
                    });
                    meshCount++;
                }
            });

            // --- 90% BOUNDING BOX AUTO-SCALE ---
            const box = new THREE.Box3().setFromObject(this.model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            this.model.position.sub(center); // Normalize to world center

            const maxDimension = Math.max(size.x, size.y, size.z);
            const fovInRadians = this.camera.fov * (Math.PI / 180);
            
            // Camera distance calculation for ~90% frame fit
            let distance = Math.abs(maxDimension / 2 / Math.tan(fovInRadians / 2));
            this.camera.position.set(distance * 0.8, distance * 0.6, distance * 1.05);
            
            this.camera.updateProjectionMatrix();
            this.orbit.update();

            this.scene.add(this.model);
            this.transform.attach(this.model);
        });
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const delta = this.clock.getDelta();

        // Rotation logic handles Play/Stop and pauses automatically during Drag
        if (this.model && this.isRotating && !this.transform.dragging) {
            this.model.rotation.y += this.rotationSpeed * delta;
        }

        this.orbit.update();
        this.renderer.render(this.scene, this.camera);
    }
}

const StudioApp = new DigitalTwinStudio();
StudioApp.loadModel('new_base_twin.glb');