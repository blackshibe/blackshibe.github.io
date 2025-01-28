precision mediump float;

// our texture
uniform sampler2D u_image;
uniform sampler2D u_inverted_texture;
uniform float u_time;
uniform float u_glitch;
uniform float u_invert;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

float sat( float t ) {
    return clamp( t, 0.0, 1.0 );
}

vec2 sat( vec2 t ) {
    return clamp( t, 0.0, 1.0 );
}

//remaps inteval [a;b] to [0;1]
float remap  ( float t, float a, float b ) {
    return sat( (t - a) / (b - a) );
}

//note: /\ t=[0;0.5;1], y=[0;1;0]
float linterp( float t ) {
    return sat( 1.0 - abs( 2.0*t - 1.0 ) );
}

vec3 spectrum_offset( float t ) {
    float t0 = 3.0 * t - 1.5;
    //return vec3(1.0/3.0);
    return clamp( vec3( -t0, 1.0-abs(t0), t0), 0.0, 1.0);
    /*
    vec3 ret;
    float lo = step(t,0.5);
    float hi = 1.0-lo;
    float w = linterp( remap( t, 1.0/6.0, 5.0/6.0 ) );
    float neg_w = 1.0-w;
    ret = vec3(lo,1.0,hi) * vec3(neg_w, w, neg_w);
    return pow( ret, vec3(1.0/2.2) );
*/
}

//note: [0;1]
float rand( vec2 n ) {
    return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

//note: [-1;1]
float srand( vec2 n ) {
    return rand(n) * 2.0 - 1.0;
}

float mytrunc( float x, float num_levels )
{
    return floor(x*num_levels) / num_levels;
}
vec2 mytrunc( vec2 x, float num_levels )
{
    return floor(x*num_levels) / num_levels;
}

vec3 lerp( vec3 a, vec3 b, float t )
{
    return a + (b-a)*t;
}

float rand(float co) { return fract(sin(co*(91.3458)) * 47453.5453); }
vec4 get_noise(float x)
{
	float strength = 0.01;
    
    if (rand(x) > 0.999) return vec4(strength, strength, strength, 0.0);
	else if (rand(x) > 0.9) return vec4(strength, 0.0, 0.0, 0.0);
	else if (rand(x) > 0.8) return vec4(0.0, strength, 0.0, 0.0);
	else if (rand(x) > 0.6) return vec4(0.0, 0.0, strength, 0.0);
	else return  vec4(0.0, 0.0, 0.0, 0.0);
}

void main() {
    float aspect = v_texCoord.x / v_texCoord.y;
    vec2 uv = v_texCoord;

    float time = u_time;
    float GLITCH = 1.0 * u_glitch;

    float rdist = length( (uv - vec2(0.5,0.5)));
    // if (rdist < 0.5) {
        // GLITCH *= rdist;
    // }

    float gnm = sat( GLITCH );
    float rnd0 = rand( mytrunc( vec2(time, time), 6.0 ) );
    float r0 = sat((1.0-gnm)*0.7 + rnd0);
    float rnd1 = rand( vec2(mytrunc( uv.x, 10.0*r0 ), time) ); //horz
    // float r1 = 1.0f - sat( (1.0f-gnm)*0.5f + rnd1 );
    float r1 = 0.5 - 0.5 * gnm + rnd1;
    r1 = 1.0 - max( 0.0, ((r1<1.0) ? r1 : 0.99999) );
    float rnd2 = rand( vec2(mytrunc( uv.y, 40.0*r1 ), time) ); //vert
    float r2 = sat( rnd2 );

    float rnd3 = rand( vec2(mytrunc( uv.y, 10.0*r0 ), time) );
    float r3 = (1.0-sat(rnd3+0.8)) - 0.1;

    float pxrnd = rand( uv + time );

    float ofs = 0.05 * r2 * GLITCH * ( rnd0 > 0.5 ? 1.0 : -1.0 );
    ofs += 0.5 * pxrnd * ofs;

    uv.y += 0.1 * r3 * GLITCH;

    const int NUM_SAMPLES = 10;
    const float RCP_NUM_SAMPLES_F = 1.0 / float(NUM_SAMPLES);

    vec4 sum = vec4(0.0);
    vec3 wsum = vec3(0.0);
    for( int i=0; i<NUM_SAMPLES; ++i )
    {
        float t = float(i) * RCP_NUM_SAMPLES_F;
        uv.x = sat( uv.x + ofs * t );
        vec4 samplecol = texture2D(u_image, uv);
        vec3 s = spectrum_offset( t );
        samplecol.rgb = samplecol.rgb * s;
        sum += samplecol;
        wsum += s;
    }
    sum.rgb /= wsum;
    sum.a *= RCP_NUM_SAMPLES_F;

    sum.rgb += get_noise(rand(u_time) + rdist).xyz;

    gl_FragColor.a = sum.a;
    gl_FragColor.rgb = lerp(sum.rgb, texture2D(u_image, uv).rgb, -1.0);

    if (u_invert > 1.5) return;

    vec3 text = texture2D(u_inverted_texture, uv + vec2(0.0, sin(u_time * 0.01) * 0.1)).rgb;
    gl_FragColor.rgb += text * u_invert;
}