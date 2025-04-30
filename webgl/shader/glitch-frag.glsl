precision highp float;

// boring stuff
uniform sampler2D u_image;
uniform sampler2D u_inverted_texture;
uniform vec2 u_resolution;
uniform vec2 u_img_resolution;

// fun stuff
uniform float u_time;
uniform float u_glitch;
uniform float u_invert;
uniform vec2 u_mouse_position;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

float sat(float t) {
    return clamp(t, 0.0, 1.0);
}

vec2 sat(vec2 t) {
    return clamp(t, 0.0, 1.0);
}

//remaps inteval [a;b] to [0;1]
float remap(float t, float a, float b) {
    return sat((t - a) / (b - a));
}

//note: /\ t=[0;0.5;1], y=[0;1;0]
float linterp(float t) {
    return sat(1.0 - abs(2.0 * t - 1.0));
}

vec3 spectrum_offset(float t) {
    float t0 = 3.0 * t - 1.5;
    //return vec3(1.0/3.0);
    return clamp(vec3(-t0, 1.0 - abs(t0), t0), 0.0, 1.0);
}

//note: [0;1]
float rand(vec2 n) {
    return fract(sin(dot(n.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

//note: [-1;1]
float srand(vec2 n) {
    return rand(n) * 2.0 - 1.0;
}

float mytrunc(float x, float num_levels) {
    return floor(x * num_levels) / num_levels;
}

vec2 mytrunc(vec2 x, float num_levels) {
    return floor(x * num_levels) / num_levels;
}

vec3 lerp(vec3 a, vec3 b, float t) {
    return a + (b - a) * t;
}

float rand(float co) { 
    return fract(sin(co * (91.3458)) * 47453.5453); 
}

vec4 get_noise(float x) {
    float strength = 0.01;
    
    if (rand(x) > 0.999) return vec4(strength, strength, strength, 0.0);
    else if (rand(x) > 0.9) return vec4(strength, 0.0, 0.0, 0.0);
    else if (rand(x) > 0.8) return vec4(0.0, strength, 0.0, 0.0);
    else if (rand(x) > 0.6) return vec4(0.0, 0.0, strength, 0.0);
    else return vec4(0.0, 0.0, 0.0, 0.0);
}

vec4 noise_shader(float strength) {
    vec2 uv = v_texCoord;
	vec4 color = vec4(1.0, 0.0, 0.0, 1);

	float x = (uv.x + 1.0) * (uv.y + 0.0123421) * (u_time * 0.1);

	if (rand(x) > 0.98) return vec4(strength, strength, strength, 0.0);
	else if (rand(x) > 0.9) return vec4(strength, 0.0, 0.0, 0.0);
	else if (rand(x) > 0.8) return vec4(0.0, strength, 0.0, 0.0);
	else if (rand(x) > 0.6) return vec4(0.0, 0.0, strength, 0.0);
	else return vec4(0.0, 0.0, 0.0, 0.0);
}

void main() {
    float image_aspect = u_resolution.x / u_resolution.y;
    float screen_aspect = u_img_resolution.x / u_img_resolution.y;

    // center image and correct aspect ratio
    vec2 offset = ((u_img_resolution - u_resolution) / u_resolution) / vec2(2.0, 2.0);
    vec2 uv = v_texCoord / (u_resolution / u_img_resolution);
    uv -= offset;
    uv.x += 0.1;

    // noise blackbox magic
    float time = u_time;
    float GLITCH = 0.0;// 1.0 * u_glitch;

    float rdist = length((uv - vec2(0.5, 0.5)));
    float gnm = sat(GLITCH);
    float rnd0 = rand(mytrunc(vec2(time, time), 6.0));
    float r0 = sat((1.0 - gnm) * 0.7 + rnd0);
    float rnd1 = rand(vec2(mytrunc(uv.x, 10.0 * r0), time)); //horz
    float r1 = 0.5 - 0.5 * gnm + rnd1;
    r1 = 1.0 - max(0.0, ((r1 < 1.0) ? r1 : 0.99999));
    float rnd2 = rand(vec2(mytrunc(uv.y, 40.0 * r1), time)); //vert
    float r2 = sat(rnd2);

    float rnd3 = rand(vec2(mytrunc(uv.y, 10.0 * r0), time));
    float r3 = (1.0 - sat(rnd3 + 0.8)) - 0.1;

    float pxrnd = rand(uv + time);

    float ofs = 0.05 * r2 * GLITCH * (rnd0 > 0.5 ? 1.0 : -1.0);
    ofs += 0.5 * pxrnd * ofs;
    uv.y += 0.1 * r3 * GLITCH;

    // move based on mouse position
    uv.x += u_mouse_position.x / 20.0;
    uv.y += u_mouse_position.y / 40.0;

    // chromatic aberration
    float distance_to_center = length(vec2(v_texCoord.x, v_texCoord.y) - u_mouse_position) * 0.1;

    float chromatic_aberration = distance_to_center * distance_to_center;
    float noise_strength = distance_to_center * distance_to_center;

    // zoom in a little
    float zoom = 1.3;
    uv.x = uv.x * zoom + (1.0 - zoom) * 0.5;
    uv.y = uv.y * zoom + (1.0 - zoom) * 0.5;

    const int NUM_SAMPLES = 10;
    const float RCP_NUM_SAMPLES_F = 1.0 / float(NUM_SAMPLES);

    vec4 sum = vec4(0.0);
    vec3 wsum = vec3(0.0);
    for (int i = 0; i < NUM_SAMPLES; ++i) {
        float t = float(i) * RCP_NUM_SAMPLES_F;
        uv.x = sat(uv.x + ofs * t);

        vec4 samplecol = vec4(
            texture2D(u_image, uv + vec2(chromatic_aberration, 0.0)).r,
            texture2D(u_image, uv + vec2(0.0, 0.0)).g,
            texture2D(u_image, uv + vec2(-chromatic_aberration, 0.0)).b,
            1.0
        );

        vec3 s = spectrum_offset(t);
        samplecol.rgb = samplecol.rgb * s;
        sum += samplecol;
        wsum += s;
    }
    sum.rgb /= wsum;
    sum.a *= RCP_NUM_SAMPLES_F;

    sum.rgb += get_noise(rand(u_time) + rdist).xyz;
    sum.rgb -= vec3(0.8, 1.0, 1.0) * (noise_strength * 4.0);

    gl_FragColor.a = sum.a;
    gl_FragColor.rgb = lerp(sum.rgb, texture2D(u_image, uv).rgb, -1.0);

    uv.x += (u_mouse_position.x + 0.5) / 20.0;
    uv.y += (u_mouse_position.y + 0.5) / 40.0;

    vec4 inverted_data = texture2D(u_inverted_texture, uv);
    gl_FragColor.rgb = lerp(gl_FragColor.rgb, inverted_data.rgb, inverted_data.a);
    gl_FragColor.rgb += noise_shader(noise_strength * 25.0).xyz;
}