const main_info = document.getElementById("main-info");

function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = src;
		img.onload = () => resolve(img);
		img.onerror = (err) => reject(new Error(`Failed to load image: ${src}`));
	});
}

function setRectangle(gl, x, y, width, height) {
	var x1 = x;
	var x2 = x + width;
	var y1 = y;
	var y2 = y + height;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW);
}

async function resize_image(img, newWidth, newHeight) {
	// Create canvas with new dimensions
	const canvas = document.createElement("canvas");
	canvas.width = newWidth;
	canvas.height = newHeight;

	// Draw resized image
	const ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, newWidth, newHeight);

	// Return as Image object
	return new Promise((resolve) => {
		const resizedImg = new Image();
		resizedImg.onload = () => resolve(resizedImg);
		resizedImg.src = canvas.toDataURL("image/png");
	});
}

function calculate_new_size(origWidth, origHeight, maxSize) {
	if (origWidth <= maxSize && origHeight <= maxSize) {
		return { width: origWidth, height: origHeight };
	}

	const ratio = Math.min(maxSize / origWidth, maxSize / origHeight);
	return {
		width: Math.floor(origWidth * ratio),
		height: Math.floor(origHeight * ratio),
	};
}

async function fix_image_size_for_webgl(gl, image) {
	const max_size = Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), 2048);

	if (image.width < max_size && image.height < max_size) return image;

	const { width, height } = calculate_new_size(image.width, image.height, max_size);
	return await resize_image(image, width, height);
}

export async function glitch_start() {
	let imageIndex = Math.floor(Math.random() * 5) + 1;
	let image = await loadImage(`webgl/texture/active-${imageIndex}.jpg`);
	let invert_settings = [true, false, false, false, true, false, false];
	const overlay_img = await loadImage(`webgl/texture/inversion-${imageIndex}.png`);

	const canvas = document.querySelector("#img-canvas");
	const image_picker = document.querySelector("#file");
	const gl = canvas.getContext("webgl");
	if (!gl) {
		return;
	}

	image = await fix_image_size_for_webgl(gl, image);

	// setup GLSL program
	var program = await webglUtils.createProgramFromScripts(gl, ["glitch-vert", "glitch-frag"]);

	// look up where the vertex data needs to go.
	const early_variables = {
		position: gl.getAttribLocation(program, "a_position"),
		texture_coord: gl.getAttribLocation(program, "a_texCoord"),
	};

	// Create a buffer to put three 2d clip space points in
	var positionBuffer = gl.createBuffer();

	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	// Set a rectangle the same size as the image.
	setRectangle(gl, 0, 0, image.width, image.height);

	// provide texture coordinates for the rectangle.
	var texcoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
		gl.STATIC_DRAW
	);

	// Create a texture.
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the parameters so we can render any size image.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	// Upload the image into the texture.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	var texture2 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture2);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, overlay_img);

	// go back to editing first texture
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Clear the canvas
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	let gl_variables = {
		u_resolution: gl.getUniformLocation(program, "u_resolution"),
		u_img_resolution: gl.getUniformLocation(program, "u_img_resolution"),
		u_time: gl.getUniformLocation(program, "u_time"),
		u_glitch: gl.getUniformLocation(program, "u_glitch"),
		u_invert: gl.getUniformLocation(program, "u_invert"),
		u_mouse_position: gl.getUniformLocation(program, "u_mouse_position"),
		u_inverted_texture: gl.getUniformLocation(program, "u_inverted_texture"),
	};

	// Turn on the position attribute
	gl.enableVertexAttribArray(early_variables.position);

	// Bind the position buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	var size = 2; // 2 components per iteration
	var type = gl.FLOAT; // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0; // start at the beginning of the buffer
	gl.vertexAttribPointer(early_variables.position, size, type, normalize, stride, offset);

	// Turn on the texcoord attribute
	gl.enableVertexAttribArray(early_variables.texture_coord);

	// bind the texcoord buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

	// Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
	var size = 2; // 2 components per iteration
	var type = gl.FLOAT; // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0; // start at the beginning of the buffer
	gl.vertexAttribPointer(early_variables.texture_coord, size, type, normalize, stride, offset);

	// count mouse movement inbetween frames
	let mouse = { x: 0, y: 0 };
	let last_mouse = { x: 0, y: 0 };

	document.onmousemove = function (e) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
		delay = 5;
	};

	let time = 1;
	let delay = 1;
	let last_mouse_position = { x: 0, y: 0 };

	function lerp(a, b, t) {
		return a + (b - a) * t;
	}

	const frame_step = 1 / 12;
	let next_update_time = Date.now() + frame_step * 1000; // in milliseconds

	function draw() {
		if (Date.now() < next_update_time) {
			requestAnimationFrame(draw);
			return;
		}

		main_info.classList.remove("hidden");

		next_update_time = Date.now() + frame_step * 1000; // in milliseconds

		webglUtils.resizeCanvasToDisplaySize(gl.canvas);
		setRectangle(gl, 0, 0, image.width, image.height);

		// count mouse
		let mouse_dx = mouse.x - last_mouse.x;
		let mouse_dy = mouse.y - last_mouse.y;

		// update mouse
		last_mouse.x = mouse.x;
		last_mouse.y = mouse.y;

		let new_mouse_position = {
			x: lerp(last_mouse_position.x, mouse.x / window.innerWidth, 0.5),
			y: lerp(last_mouse_position.y, mouse.y / window.innerHeight, 0.5),
		};

		time += 1;

		gl.uniform2f(gl_variables.u_resolution, image.width, image.height);
		gl.uniform2f(gl_variables.u_img_resolution, canvas.width, canvas.height);
		gl.uniform1f(gl_variables.u_time, time);
		gl.uniform1f(gl_variables.u_invert, invert_settings[imageIndex] ? -1 : 1);
		gl.uniform1f(gl_variables.u_glitch, 0.01 + (mouse_dx + mouse_dy) / 6000);
		gl.uniform2f(gl_variables.u_mouse_position, new_mouse_position.x, new_mouse_position.y);
		if (Math.random() > 0.95) gl.uniform1f(gl_variables.u_glitch, 1.0);

		last_mouse_position.x = new_mouse_position.x;
		last_mouse_position.y = new_mouse_position.y;

		// actual render

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texture2);
		gl.uniform1i(gl_variables.u_inverted_texture, 1);

		// bind the texcoord buffer.
		gl.bindTexture(gl.TEXTURE_2D, texture2);
		gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

		// Draw the rectangle.
		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 6;

		gl.drawArrays(primitiveType, offset, count);

		requestAnimationFrame(draw);
	}

	image_picker.onchange = function (e) {
		let max_size = gl.getParameter(gl.MAX_TEXTURE_SIZE);

		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = function (event) {
			let img = new Image();
			img.onload = async function () {
				img = await fix_image_size_for_webgl(gl, img);

				if (img.height > max_size || img.width > max_size) {
					alert(`image is too big - max width and height is ${max_size}`);
					return;
				}

				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
			};
			img.src = event.target.result;
		};
		reader.readAsDataURL(file);
	};

	window.addEventListener("resize", () => {
		draw();
		next_update_time = 0;
	});

	draw();
}
