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

const colors = {
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

export {colors}
