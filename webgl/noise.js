export const noise_options = {
	enabled: true,
	strength: 1,
};

export async function noise_start() {
	const canvas = document.querySelector("#main-canvas");
	const gl = canvas.getContext("webgl");
	if (!gl) {
		return;
	}

	// setup GLSL program
	const program = await webglUtils.createProgramFromScripts(gl, ["noise-vert", "noise-frag"]);

	// look up where the vertex data needs to go.
	const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

	// Create a buffer to put three 2d clip space points in
	const positionBuffer = gl.createBuffer();

	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// fill it with a 2 triangles that cover clipspace
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			-1,
			-1, // first triangle
			1,
			-1,
			-1,
			1,
			-1,
			1, // second triangle
			1,
			-1,
			1,
			1,
		]),
		gl.STATIC_DRAW
	);

	webglUtils.resizeCanvasToDisplaySize(gl.canvas);

	const uniforms = {
		u_resolution: gl.getUniformLocation(program, "u_resolution"),
		u_time: gl.getUniformLocation(program, "u_time"),
		u_strength: gl.getUniformLocation(program, "u_strength"),
	};

	function draw() {
		canvas.style.opacity = noise_options.enabled ? 1 : 0;
		if (!noise_options.enabled) return;

		webglUtils.resizeCanvasToDisplaySize(gl.canvas);

		// Tell WebGL how to convert from clip space to pixels
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		// Tell it to use our program (pair of shaders)
		gl.useProgram(program);

		// Turn on the attribute
		gl.enableVertexAttribArray(positionAttributeLocation);

		// Bind the position buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		gl.vertexAttribPointer(
			positionAttributeLocation,
			2, // 2 components per iteration
			gl.FLOAT, // the data is 32bit floats
			false, // don't normalize the data
			0, // 0 = move forward size * sizeof(type) each iteration to get the next position
			0 // start at the beginning of the buffer
		);

		gl.uniform2f(uniforms.u_resolution, gl.canvas.width, gl.canvas.height);
		gl.uniform1f(uniforms.u_time, new Date().getMilliseconds());
		gl.uniform1f(uniforms.u_strength, noise_options.strength * 0.5);

		gl.drawArrays(
			gl.TRIANGLES,
			0, // offset
			6 // num vertices to process
		);

		gl.clearColor(0, 0, 0, 0);

		requestAnimationFrame(draw);
	}

	draw();
}
