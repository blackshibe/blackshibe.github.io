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

async function render() {
	let imageIndex = Math.floor(Math.random() * 9) + 1;
	let inversionIndex = Math.floor(Math.random() * 9) + 1;
	let invert = [false, true, false, false, false, false, false, false, false];
	let skip_text = Math.random() > 0.6;
	const image = await loadImage(`webgl/texture/active-${imageIndex}.jpg`);
	const inverted_image = await loadImage(`webgl/texture/inversion-${inversionIndex}.png`);

	const canvas = document.querySelector("#img-canvas");
	const image_picker = document.querySelector("#file");
	const gl = canvas.getContext("webgl");
	if (!gl) {
		return;
	}

	// setup GLSL program
	var program = await webglUtils.createProgramFromScripts(gl, ["glitch-vert", "glitch-frag"]);

	// look up where the vertex data needs to go.
	var positionLocation = gl.getAttribLocation(program, "a_position");
	var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

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
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inverted_image);

	// go back to editing first texture
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// lookup uniforms
	var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	var timeLocation = gl.getUniformLocation(program, "u_time");
	var glitchLocation = gl.getUniformLocation(program, "u_glitch");
	var invertLocation = gl.getUniformLocation(program, "u_invert");
	var texture2Location = gl.getUniformLocation(program, "u_inverted_texture");

	webglUtils.resizeCanvasToDisplaySize(gl.canvas);

	// Clear the canvas
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	// Turn on the position attribute
	gl.enableVertexAttribArray(positionLocation);

	// Bind the position buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	var size = 2; // 2 components per iteration
	var type = gl.FLOAT; // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0; // start at the beginning of the buffer
	gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

	// Turn on the texcoord attribute
	gl.enableVertexAttribArray(texcoordLocation);

	// bind the texcoord buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

	// Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
	var size = 2; // 2 components per iteration
	var type = gl.FLOAT; // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0; // start at the beginning of the buffer
	gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);

	// count mouse movement inbetween frames
	let mouse = { x: 0, y: 0 };
	let last_mouse = { x: 0, y: 0 };

	document.onmousemove = function (e) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
		delay = 5;
	};

	let time = 1;
	let delay = 20;
	let last_processed_time = 0;

	function draw() {
		// Tell WebGL how to convert from clip space to pixels
		canvas.height = canvas.width;

		// count mouse
		let mouse_dx = mouse.x - last_mouse.x;
		let mouse_dy = mouse.y - last_mouse.y;

		// update mouse
		last_mouse.x = mouse.x;
		last_mouse.y = mouse.y;

		time += 1;

		let processed_time = Math.floor(time / delay);
		if (skip_text) gl.uniform1f(invertLocation, 2);

		if (last_processed_time != processed_time) {
			last_processed_time = processed_time;
			delay = 4;

			gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
			gl.uniform1f(timeLocation, Math.floor(time / delay));
			gl.uniform1f(invertLocation, invert[imageIndex - 1] ? -1 : 1);
			gl.uniform1f(glitchLocation, 0.1 + (mouse_dx + mouse_dy) / 10);

			let max_glitch_frame = false;
			if (Math.random() > 0.995) max_glitch_frame = true;
			if (max_glitch_frame) gl.uniform1f(glitchLocation, 10.0);

			// actual render
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, texture2);
			gl.uniform1i(texture2Location, 1);

			// bind the texcoord buffer.
			gl.bindTexture(gl.TEXTURE_2D, texture2);
			gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

			// Draw the rectangle.
			var primitiveType = gl.TRIANGLES;
			var offset = 0;
			var count = 6;
			gl.drawArrays(primitiveType, offset, count);
		}

		requestAnimationFrame(draw);
	}

	image_picker.onchange = function (e) {
		let max_size = gl.getParameter(gl.MAX_TEXTURE_SIZE);

		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = function (event) {
			const img = new Image();
			img.onload = function () {
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

	draw();
}

render();
