# GFX - Web graphics

This package contains code from:

- my learning of WebGL
- subsequent experiments
- efforts to rationalize and organize my thoughts on these subjects

## Developing

🚧 WIP

### GLSL

```
import shader from '/some/shader.glsl?raw'
```

## Tools & Resources

- 👾 Everything related to working with webgl
  - [MDN WebGL API Doc](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
  - [WebGL Fundamentals](https://webglfundamentals.org/)
  - [WebGL Fundamentals - 2](https://webgl2fundamentals.org/)
  - [The Book of Shaders](https://thebookofshaders.com/)
  - [Inigo Quilez](https://iquilezles.org/)
  - [Learn WebGL](https://learnwebgl.brown37.net/index.html)
  - [Introduction to computer graphics](https://math.hws.edu/graphicsbook/index.html)
  - [Introduction to WebGL](https://dev.opera.com/articles/introduction-to-webgl-part-1/)

## Notes from WebGL courses

<details>
<summary><b>Raw WebGL - Nick Desaulniers</b></summary>
<p>

**Src:** https://www.youtube.com/watch?v=H4c8t6myAWU

**Slides:** https://nickdesaulniers.github.io/RawWebGL/#/

A webGL app consists of three types of assets

- shaders
  - vertex
  - fragment
- buffers (arrays of moving data)
  - camera position
  - light position
  - color
  - generic data
- textures: bitmap mapped to a mesh=model
  - images
  - video

### Glossary

**Samples** (sampling = reduction of continuous signal to discrete signal)

- sound
- images = sampling (analog to digital)

**Fragment** pixel data generated during rasterisation process. It contains info on:

- color
- depth
- value
- texture coordinates
- ...

**Frame** Individual still image out of a moving picture, displayed during `displayAnimationFrame`

**Shading** Modeling 2D pixel information from 3D data

**Material** Description of how a surface reacts to light

**Shaders** Programs that come in pairs and that describe how pixels should display on any given frame by running massively in parallel in the GPU

- a vertex shader can feed into a fragment shader
- they can be mixed as long as the outputs of one match the inputs of the other
- apparently the are like Mr Potato head:- I can re-use shaders that i wrote before and mix them with other shaders
- Vertex shaders : run once for every vertex
- Fragment shader: run once for every fragment, color values are interpolated between fragments

## Field of View

Viewing space in the shape of a Frustum beyond which objects get culled=dropped

Clipping planes of a Frustum:

- near clipping plane
- far clipping plane
- top clipping plane
- bottom clipping plane
- right clipping plane
- left clipping plane

## Coordinate systems

### Canvas 3D

A `2*2*2` cube:

- x=[-1, 1]
- y=[-1, 1]
- z=[-1, 1]

Anything drawn outside the coordinate system gets culled

Physical representation of origin:

- right hand:
  - index up = +y
  - thumb out = +x
  - middle in = +z

### Textures

`st` or `uv`

Same coordinate system as Canvas 3D, without the `z`.

- [1, 1] = top right corner

BUT: bitmaps store vertical data in reverse: we need to flip the `y` coordinates data to use it

### GLSL Types

Uniforms and Attributes are shader inputs

#### Uniforms

- inputs for vertex & fragment shaders
- same for all vertices & fragments

#### Attributes

- inputs for vertex shaders
- unique per vertex

#### Varyings

- Communication channel between shaders: vertex shader feeds into fragment shader:
  - vertex output
  - fragment input

### Running a program

1. Get WebGL context from a canvas
1. Clear the canvas
1. [...write shaders]
   1. vertex shaders
      - objective = assign values to `gl_Position`
      - optional objective = assign values to `gl_PointSize` (if we are drawing points)
   1. fragment shaders
      - must specify resolution of floating point math (targets mobile device support - not best webgl support (?))
      - objective = assign values to uniform `gl_FragColor`
1. Grab shaders: compile shaders into a program
   - write a helper function to compile (will re-use)

## Perspective

1. **Model matrix** matrix of transformations of model relative to its original coordinates (scale, rotation, translation)
1. **View matrix** describes position of the viewer, where the viewer is looking and direction of where "up" is located
1. **Projection matrix** Describes the viewing angle, aspect ratio and near and far clipping planes of viewing frustum: points farther away get smaller

## Drawing modes

`gl.drawArrays(mode, start, numVertices)` can take:

- `gl.POINTS`
- `gl.LINES`
- `gl.LINE_STRIP`
- `gl.LINE_LOOP`
- `gl.TRIANGLES`
- `gl.TRIANGLE_STRIP`
- `gl.TRIANGLE_FAN`

</p></details>
