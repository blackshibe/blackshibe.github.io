import * as THREE from "three";
import { GLTFLoader } from "https://unpkg.com/three@0.154.0/examples/jsm/loaders/GLTFLoader.js";
import { noise_options, noise_start } from "/webgl/noise.js";

const canvas = document.querySelector("#img-canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const image_data = [
	{
		name: "2025 04 23",
		photos: [
			"photo/2025-04-23/DSCF8269.JPG",
			"photo/2025-04-23/DSCF8268.JPG",
			"photo/2025-04-23/DSCF8244.JPG",
			"photo/2025-04-23/DSCF7648.JPG",
			"photo/2025-04-23/DSCF8183.JPG",
		],
	},
	{
		name: "2025 04 23",
		photos: ["photo/2025-04-23/DSCF8165.JPG"],
	},
	{
		name: "",
		photos: ["photo/2025-04-19/DSCF7523.JPG", "photo/2025-04-19/DSCF7529.JPG"],
	},
	{
		name: "2025 04 19",
		photos: [
			"photo/2025-04-19/DSCF7547.JPG",
			"photo/2025-04-19/DSCF7545.JPG",
			"photo/2025-04-19/DSCF7515.JPG",
			"photo/2025-04-19/DSCF7472.JPG",
			"photo/2025-04-19/DSCF7449.JPG",
			"photo/2025-04-19/DSCF7447.JPG",
			"photo/2025-04-19/DSCF7435.JPG",
			"photo/2025-04-19/DSCF7418.JPG",
			"photo/2025-04-19/DSCF7395.JPG",
			"photo/2025-04-19/DSCF7390.JPG",
		],
	},
	{
		name: "",
		photos: [
			"photo/2025-04-19/DSCF7298.JPG",
			"photo/2025-04-19/DSCF7326.JPG",
			"photo/2025-04-19/DSCF7314.JPG",
			"photo/2025-04-19/DSCF7330.JPG",
		],
	},
	{
		name: "2025 04 18",
		photos: [
			"photo/2025-04-18/DSCF6920.jpg",
			"photo/2025-04-18/DSCF6963.jpg",
			"photo/2025-04-18/DSCF6957.jpg",
			"photo/2025-04-18/DSCF6944.jpg",
		],
	},
	{
		name: "2025 02 25",
		photos: [
			"photo/2025-02-25/DSC5036.JPG",
			"photo/2025-02-25/DSC5121.JPG",
			"photo/2025-02-25/DSC5101.JPG",
			"photo/2025-02-25/DSC5057.JPG",
		],
	},
	{
		name: "2024 12 23",
		photos: [
			"photo/2024-12-23/20241223_000742662.jpg",
			"photo/2024-12-23/20241223_001007168.jpg",
			"photo/2024-12-23/20241223_001331184.jpg",
			"photo/2024-12-23/20241223_001207332.png",
			"photo/2024-12-23/20241223_001207332-2.jpg",
		],
	},
	{
		name: "2024 12 20",
		photos: ["photo/2024-12-23/20241214_205258193.jpg", "photo/2024-12-23/20241221_005659647.jpg"],
	},
	{
		name: "2024 11 08",
		photos: ["photo/2024-11-08/20241108_171851.jpg", "photo/2024-11-08/20241108_175445.jpg"],
	},
	{
		name: "2024 10 28",
		photos: ["photo/2024-11-03/20241027_142721.JPG", "photo/2024-11-03/20241027_135925.JPG"],
	},
	{
		name: "2024 09 10",
		photos: [
			"photo/2024-11-03/picked/20240911_114149.jpg",
			"photo/2024-11-03/picked/20240913_190906.jpg",
			"photo/2024-11-03/picked/20240911_103518.jpg",
			"photo/2024-11-03/picked/20240911_110628.jpg",
			"photo/2024-11-03/picked/20240912_110545.jpg",
			"photo/2024-11-03/picked/20240912_105235.jpg",
			"photo/2024-11-03/picked/20240912_152214.jpg",
			"photo/2024-11-03/picked/20240913_124046.jpg",
		],
	},
	{
		name: "2024 09 10",
		photos: ["photo/2024-09-10/20240910_104253.jpg", "photo/2024-09-10/20240910_104315.jpg"],
	},
	{
		name: "2024 09 08",
		photos: ["photo/2024-09-10/20240814_191332.jpg", "photo/2024-09-10/20240906_101201.jpg"],
	},
	{
		name: "2024 09 03",
		photos: [
			"photo/2024-09-03/20240903_181322.jpg",
			"photo/2024-09-03/20240903_141958.jpg",
			"photo/2024-09-03/20240903_140723.jpg",
			"photo/2024-09-03/20240903_143456.jpg",
		],
	},
	{
		name: "2024 08 14",
		photos: [
			"photo/2024-08-14/20240814_184708-2.jpg",
			"photo/2024-08-14/20240814_190657.jpg",
			"photo/2024-08-14/20240814_164903.jpg",
			"photo/2024-08-14/20240814_191433-2.jpg",
			"photo/2024-08-14/20240814_191332.jpg",
			"photo/2024-08-14/20240814_183858.jpg",
		],
	},
	{
		name: "2024 08 13",
		photos: [
			"photo/2024-08-13/20240812_181300-2.jpg",
			"photo/2024-08-13/20240812_190752.jpg",
			"photo/2024-08-13/20240812_180642.jpg",
			"photo/2024-08-13/20240812_180400.jpg",
			"photo/2024-08-13/20240812_201025.jpg",
			"photo/2024-08-13/20240812_200523.jpg",
		],
	},
	{
		name: "2024 07 27",
		photos: [
			"photo/29 07 2024/20240727_120354.jpg",
			"photo/29 07 2024/20240727_161114.jpg",
			"photo/29 07 2024/20240727_183213.jpg",
			"photo/29 07 2024/20240727_171006.jpg",
			"photo/29 07 2024/20240727_191211.jpg",
			"photo/29 07 2024/20240727_182217.jpg",
			"photo/29 07 2024/20240727_194949.jpg",
			"photo/29 07 2024/20240727_194945.jpg",
			"photo/29 07 2024/20240727_145047.jpg",
			"photo/29 07 2024/20240727_172045.jpg",
		],
	},
	{
		name: "old photos",
		photos: [
			"photo/17 07 2024/20240717_172930.jpg",
			"photo/17 07 2024/20240717_182554-Enhanced-NR.jpg",
			"photo/wallpaper/DSC_0102.JPG",
			"photo/wallpaper/DSC_0008.JPG",
		],
	},
];

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// const loader = new GLTFLoader();
// loader.load(
// 	// resource URL
// 	"/page/model/spectra/scene.gltf",
// 	// called when the resource is loaded
// 	function (gltf) {
// 		gltf.scene.traverse((child) => {
// 			if (child.isMesh) {
// 				child.material.transparent = true;
// 				child.material.opacity = 0.5;
// 				child.position.set(0, 0, -10);
// 			}
// 		});

// 		scene.add(gltf.scene);
// 	},
// 	// called while loading is progressing
// 	function (xhr) {
// 		console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
// 	},
// 	// called when loading has errors
// 	function (error) {}
// );

// generate planes with images
const positions = [];
image_data.forEach((element, group_index) => {
	const group = new THREE.Group();
	let pos = 0;
	element.photos.forEach((photo, index) => {
		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load(
			photo.replace("JPG", "preview.JPG").replace("jpg", "preview.jpg"),
			(texture) => {
				// base size on texture aspect ratio
				const aspect = texture.image.width / texture.image.height;

				const geometry = new THREE.PlaneGeometry(5 * aspect, 5);
				const material = new THREE.MeshBasicMaterial({ map: texture });
				const plane = new THREE.Mesh(geometry, material);
				plane.position.set(pos + (5 * aspect) / 2, -group_index * 5.5, 0);
				group.add(plane);
				positions.push({ pos: plane.position, rot: plane.rotation });

				pos += 5 * aspect + 0.5;
			}
		);
	});
	scene.add(group);
});

camera.position.setX(-1);
camera.position.setZ(10);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const torus = new THREE.Mesh(geometry, material);

// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(5, 5, 5).normalize();
// scene.add(light);
// scene.add(torus);

let mouse = { x: 0, y: 0 };

document.onmousemove = function (e) {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
};

function lerp(a, b, t) {
	return a + (b - a) * t;
}

const current_pos = {
	x: 0,
	y: 0,
};

const render = () => {
	requestAnimationFrame(render);

	positions.forEach((element) => {
		let dist_to_mouse = Math.sqrt(
			Math.pow(mouse.x / 100 - element.pos.x, 2) +
				Math.pow(-window.scrollY / 65 - mouse.y / 600 - element.pos.y, 2)
		);
		element.pos.z = lerp(element.pos.z, -dist_to_mouse / 5, 0.1);
		element.rot.x = lerp(element.rot.x, dist_to_mouse * 0.01, 0.1);
	});

	const target_pos = {
		x: mouse.x / 100,
		y: -window.scrollY / 65 - mouse.y / 600,
	};

	const new_pos = {
		x: lerp(camera.position.x, target_pos.x, 0.1),
		y: lerp(camera.position.y, target_pos.y, 0.1),
	};

	camera.position.x = new_pos.x;
	camera.position.y = new_pos.y;
	current_pos.x = new_pos.x;
	current_pos.y = new_pos.y;

	renderer.render(scene, camera);
};

render();
// noise_start();
