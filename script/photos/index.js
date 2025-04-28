import * as THREE from "three";
import { noise_options, noise_start } from "/webgl/noise.js";
import { TextGeometry } from "https://threejs.org/examples/jsm/geometries/TextGeometry.js";
import { GLTFLoader } from "https://unpkg.com/three@0.154.0/examples/jsm/loaders/GLTFLoader.js";
import { image_data } from "/script/photos/image_data.js";
import { load_font } from "./load.js";
import { ImageObject } from "./class/ImageObject.js";

const expanding_view = document.getElementById("expanding-view");
const card_contents = document.getElementById("card-contents");
const site_content = document.getElementById("site-content");

const canvas = document.querySelector("#img-canvas");
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const textureLoader = new THREE.TextureLoader();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setX(-1);
camera.position.setZ(10);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

function create_text(font, text, properties) {
	const geometry = new TextGeometry(text, {
		font: font,
		size: 12,
		depth: 0.01,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.01,
		bevelSize: 0.01,
		bevelOffset: 0,
		bevelSegments: 5,
		...properties,
	});

	const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
	const font_mesh = new THREE.Mesh(geometry, material);
	scene.add(font_mesh);

	return font_mesh;
}

async function main() {
	const ROBOTO_REGULAR = await load_font("/css/font/Roboto_Regular.json");
	const load_text = create_text(ROBOTO_REGULAR, "Loading assets...", { size: 4 });
	load_text.position.set(-6, 0, -100);
	load_text.material.transparent = true;
	load_text.material.opacity = 0;

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
	const objects = [];
	const text = [];
	let to_load = 0;

	function start_loading() {
		let vertical_position = -1;
		image_data.forEach((element, group_index) => {
			const group = new THREE.Group();
			let position = 0;

			if (element.name) {
				vertical_position += 1;

				let overhead_text = create_text(ROBOTO_REGULAR, element.name, { size: 0.6 });
				overhead_text.position.set(0, -vertical_position * 8 + 4, 1);
				overhead_text.material.opacity = 0;
				overhead_text.material.transparent = true;
				text.push(overhead_text);
			} else {
				vertical_position += 0.8;
			}

			let vert_position_save = vertical_position;
			element.photos.forEach((photo, index) => {
				to_load += 1;
				expanding_view.style.height = `${vertical_position * 70}vh`;

				setTimeout(() => {
					// make the thumbnails a lot smaller btw
					textureLoader.load(photo.replace("JPG", "preview.JPG").replace("jpg", "preview.jpg"), (texture) => {
						const object = new ImageObject(texture);
						object.intended_position = [position + (5 * object.aspect) / 2, -vert_position_save * 8, 0];
						object.low_res_texture = texture;

						textureLoader.load(photo, (hi_texture) => {
							object.hi_res_texture = hi_texture;
						});

						group.add(object.plane);
						objects.push(object);

						to_load -= 1;

						position += 5 * object.aspect + 0.5;
					});
				}, index * 50 + vertical_position * 1000);
			});

			scene.add(group);
		});
	}

	// image_data.forEach((element, group_index) => {
	// 	const group = new THREE.Group();
	// 	element.photos.forEach((photo, index) => {
	// 		const textureLoader = new THREE.TextureLoader();
	// 		setTimeout(() => {
	// 			const texture = textureLoader.load(
	// 				photo.replace("JPG", "preview.JPG").replace("jpg", "preview.jpg"),
	// 				(texture) => {
	// 					// base size on texture aspect ratio
	// 					const aspect = texture.image.width / texture.image.height;

	// 					const geometry = new THREE.PlaneGeometry(5 * aspect, 5);
	// 					const material = new THREE.MeshBasicMaterial({ map: texture });
	// 					const plane = new THREE.Mesh(geometry, material);
	// 					plane.position.set(position + (5 * aspect) / 2, -group_index * 5.5, 0);
	// 					group.add(plane);
	// 					positions.push({ position: plane.position, rot: plane.rotation });

	// 					position += 5 * aspect + 0.5;
	// 				}
	// 			);
	// 		}, 2000 * group_index + 500 * index);
	// 	});
	// 	scene.add(group);
	// });

	const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
	const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
	const torus = new THREE.Mesh(geometry, material);

	// const light = new THREE.DirectionalLight(0xffffff, 1);
	// light.position.set(5, 5, 5).normalize();
	// scene.add(light);
	// scene.add(torus);

	let mouse = { x: 0, y: 0 };
	let pointer = { x: 0, y: 0 };

	document.onmousemove = function (e) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;

		pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	};

	function lerp(a, b, t) {
		return a + (b - a) * t;
	}

	const current_pos = {
		x: 0,
		y: 0,
	};

	let click_frame = false;
	let noise_strength = 0;
	let highlighted_img = undefined;
	let selected_img = undefined;

	const render = () => {
		requestAnimationFrame(render);

		raycaster.setFromCamera(pointer, camera);
		const intersects = raycaster.intersectObjects(scene.children);

		if (click_frame && selected_img) {
			selected_img = undefined;
			click_frame = false;
		}

		for (let i = 0; i < intersects.length; i++) {
			if (intersects[i].object.userData.is_image) {
				highlighted_img = intersects[i].object;
				if (click_frame && !selected_img) selected_img = highlighted_img;

				break;
			}
		}

		click_frame = false;

		load_text.material.opacity = lerp(load_text.material.opacity, to_load > 0 ? 1 : 0, 0.05);

		text.forEach((element) => {
			element.material.opacity = lerp(element.material.opacity, to_load > 0 ? 0 : 1, 0.1);
		});

		objects.forEach((element) => {
			element.material.opacity = lerp(element.material.opacity, to_load > 0 ? 0 : 1, 0.1);

			if (selected_img === element.plane) {
				element.material.map = element.hi_res_texture;

				element.plane.position.x = lerp(element.plane.position.x, camera.position.x, 0.5);
				element.plane.position.y = lerp(element.plane.position.y, camera.position.y, 0.5);
				element.plane.position.z = lerp(element.plane.position.z, 5, 0.5);

				element.plane.rotation.x = lerp(element.plane.rotation.x, -pointer.y * 0.1, 0.5);
				element.plane.rotation.y = lerp(element.plane.rotation.y, pointer.x * 0.1, 0.5);

				return;
			}

			element.material.map = element.low_res_texture;

			element.plane.position.x = lerp(element.plane.position.x, element.intended_position[0], 0.5);
			element.plane.position.y = lerp(element.plane.position.y, element.intended_position[1], 0.5);
			element.plane.position.z = lerp(element.plane.position.z, highlighted_img == element.plane ? 0.25 : 0, 0.5);
		});

		noise_strength += 0.01;
		noise_strength = Math.min(noise_strength, 0.5);
		noise_options.strength = noise_strength;

		const target_pos = {
			x: -5 + mouse.x / 50,
			y: -window.scrollY / 65 - mouse.y / 600,
		};

		if (selected_img) {
			target_pos.x = 0;
			target_pos.y = camera.position.y;
		}

		const new_pos = {
			x: lerp(camera.position.x, target_pos.x, 0.1),
			y: lerp(camera.position.y, target_pos.y, 0.8),
		};

		camera.position.x = new_pos.x;
		camera.position.y = new_pos.y;
		camera.position.z = 8.5;
		current_pos.x = new_pos.x;
		current_pos.y = new_pos.y;

		renderer.render(scene, camera);
	};

	console.log("connected");
	document.getElementById("digital").addEventListener("click", () => {
		card_contents.classList.add("opacity-0");

		setTimeout(() => {
			site_content.classList.add("hidden");
			canvas.classList.remove("opacity-0");
		}, 500);

		setTimeout(() => {
			start_loading();
		}, 1000);
	});

	document.getElementById("polaroid").addEventListener("click", () => {});
	canvas.addEventListener("click", () => {
		click_frame = true;
	});

	noise_options.strength = 1;
	noise_start();
	render();
}

main();
