import * as THREE from "three";

export class ImageObject {
	constructor(texture) {
		this.aspect = texture.image.width / texture.image.height;

		this.geometry = new THREE.PlaneGeometry(5 * this.aspect, 5);
		this.material = new THREE.MeshMatcapMaterial({ map: texture });
		this.plane = new THREE.Mesh(this.geometry, this.material);

		this.plane.userData = { is_image: true };

		// force smoother loading
		this.material.transparent = true;
		this.material.opacity = 0.01;
		this.plane.frustumCulled = false;
	}
}
