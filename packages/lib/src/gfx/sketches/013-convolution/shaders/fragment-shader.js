const defaultFrag = `#version 300 es
//FRAGMENT SHADER

// fragment shaders don't have a default precision so we need
// to pick one
precision highp float;

// our texture
uniform sampler2D u_image;

// the texCoords passed in from the vertex shader
in vec2 v_texCoord;

// We need to declare an output for the fragment shader
out vec4 outColor;

void main() {
	// Look up a color from the texture
	outColor = texture(u_image, v_texCoord);
}
`

function swapChannels(channels) {
	return `#version 300 es
  //FRAGMENT SHADER

  // fragment shaders don't have a default precision so we need
  // to pick one
  precision highp float;

  // our texture
  uniform sampler2D u_image;

  // the texCoords passed in from the vertex shader
  in vec2 v_texCoord;

  // We need to declare an output for the fragment shader
  out vec4 outColor;

  void main() {
    // Look up a color from the texture
    outColor = texture(u_image, v_texCoord).${channels};
  }
  `
}

function applyBlur(level) {
	return `#version 300 es
  //FRAGMENT SHADER

  // fragment shaders don't have a default precision so we need
  // to pick one
  precision highp float;

  // our texture
  uniform sampler2D u_image;

  // the texCoords passed in from the vertex shader
  in vec2 v_texCoord;

  // We need to declare an output for the fragment shader
  out vec4 outColor;

  void main() {
		vec2 pixels = vec2(${level}) / vec2(textureSize(u_image, 0));

    // Average the left, middle, and right pixels
    outColor = (
			texture(u_image, v_texCoord) +
			texture(u_image, v_texCoord + vec2( pixels.x / 2.0,  pixels.y / 2.0)) +
			texture(u_image, v_texCoord + vec2(-pixels.x / 2.0, -pixels.y / 2.0))) / 3.0;
  }
  `
}

function applyConvolution(level) {
	return `#version 300 es
  //FRAGMENT SHADER

  // fragment shaders don't have a default precision so we need
  // to pick one
  precision highp float;

  // our texture
  uniform sampler2D u_image;

  // The convolution kernel data
  uniform float u_kernel[9];
  uniform float u_kernelWeight;

  // the texCoords passed in from the vertex shader
  in vec2 v_texCoord;

  // We need to declare an output for the fragment shader
  out vec4 outColor;

  void main() {
		vec2 pixels = vec2(${level}) / vec2(textureSize(u_image, 0));

    vec4 colorSum = 
      texture(u_image, v_texCoord + pixels * vec2(-1, -1)) * u_kernel[0] +
      texture(u_image, v_texCoord + pixels * vec2( 0, -1)) * u_kernel[1] +
      texture(u_image, v_texCoord + pixels * vec2( 1, -1)) * u_kernel[2] +
      texture(u_image, v_texCoord + pixels * vec2(-1,  0)) * u_kernel[3] +
      texture(u_image, v_texCoord + pixels * vec2( 0,  0)) * u_kernel[4] +
      texture(u_image, v_texCoord + pixels * vec2( 1,  0)) * u_kernel[5] +
      texture(u_image, v_texCoord + pixels * vec2(-1,  1)) * u_kernel[6] +
      texture(u_image, v_texCoord + pixels * vec2( 0,  1)) * u_kernel[7] +
      texture(u_image, v_texCoord + pixels * vec2( 1,  1)) * u_kernel[8] ;
      
    // Average the left, middle, and right pixels
    outColor = vec4((colorSum / u_kernelWeight).rgb, 1);
  }
  `
}

const channels = {
	ragb: swapChannels('ragb'),
	rabg: swapChannels('rabg'),
	rbag: swapChannels('rbag'),
	rbga: swapChannels('rbga'),
	rgba: swapChannels('rgba'),
	rgab: swapChannels('rgab'),
	abgr: swapChannels('abgr'),
	abrg: swapChannels('abrg'),
	agrb: swapChannels('agrb'),
	agbr: swapChannels('agbr'),
	arbg: swapChannels('arbg'),
	argb: swapChannels('argb'),
	bagr: swapChannels('bagr'),
	barg: swapChannels('barg'),
	bgar: swapChannels('bgar'),
	bgra: swapChannels('bgra'),
	brga: swapChannels('brga'),
	brag: swapChannels('brag'),
	gabr: swapChannels('gabr'),
	garb: swapChannels('garb'),
	gbar: swapChannels('gbar'),
	gbra: swapChannels('gbra'),
	grab: swapChannels('grab'),
	grba: swapChannels('grba'),
}

const blur = {
	'blur.1': applyBlur('1'),
	'blur.2': applyBlur('2'),
	'blur.3': applyBlur('3'),
}

const convolution = {
	'convolution.1': applyConvolution(1),
	'convolution.2': applyConvolution(2),
	'convolution.3': applyConvolution(3),
}

export {channels, blur, convolution, defaultFrag}
