precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

float rand(float co) { return fract(sin(co*(91.3458)) * 47453.5453); }
float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }
float rand(vec3 co){ return rand(co.xy+rand(co.z)); }

void main() {
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	vec4 color = vec4(1.0, 0.0, 0.0, 1);

	float x = (uv.x + 1.0) * (uv.y + 0.0123421) * (u_time * 0.1);

	float strength = 0.2;

	if (rand(x) > 0.999) gl_FragColor = vec4(strength, strength, strength, 0.0);
	else if (rand(x) > 0.9) gl_FragColor = vec4(strength, 0.0, 0.0, 0.0);
	else if (rand(x) > 0.8) gl_FragColor = vec4(0.0, strength, 0.0, 0.0);
	else if (rand(x) > 0.6) gl_FragColor = vec4(0.0, 0.0, strength, 0.0);
	else gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
}