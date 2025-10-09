# KreaCAD Primitives

KreaCAD includes a powerful primitive generation system that allows you to create basic 3D shapes and advanced parametric surfaces directly in the browser.

## Available Primitives

The following primitives are available in the KreaCAD Primitive Studio:

### Basic Shapes
- **Cube**: A basic 3D cube primitive
- **Sphere**: A UV sphere with configurable segments
- **Cylinder**: A cylindrical primitive
- **Cone**: A conical primitive
- **Plane**: A flat rectangular plane
- **Torus**: A donut-shaped primitive

### Platonic Solids
- **Icosahedron**: A 20-faced polyhedron
- **Octahedron**: An 8-faced polyhedron

### Parametric Surfaces
- **Trefoil Knot**: A parametric knot with customizable parameters

## Trefoil Knot

The trefoil knot is a parametric surface that creates a complex knotted tube. It's generated using the following parametric equations:

```
x(u) = (a + b * cos(q * u)) * cos(u)
y(u) = (a + b * cos(q * u)) * sin(u)
z(u) = b * sin(q * u)
```

### Parameters

The trefoil can be customized with the following parameters:

- **a**: Major radius (default: 1.0) - Controls the overall size of the knot
- **b**: Minor radius (default: 0.4) - Controls the amplitude of the twist
- **q**: Twist count (default: 3) - Number of twists in the knot (3 creates a trefoil)
- **tube**: Tube radius (default: 0.25) - Thickness of the tube
- **segU**: U segments (default: 180) - Resolution along the curve
- **segV**: V segments (default: 24) - Resolution around the tube

Note: The UI parameter panel uses different default values (a=2.0, b=0.6) to create a more visually appealing initial trefoil.

### Usage

There are two ways to create a trefoil knot:

1. **Quick Creation**: Click the trefoil button in the primitives toolbar to create a trefoil with default parameters

2. **Custom Parameters**: Use the parameter panel on the right side:
   - Adjust the a, b, q, tube, segU, and segV values
   - Click "Generate Trefoil" to create a custom trefoil knot

### Examples

Different values of the **q** parameter create different torus knot types:

- **Trefoil Knot** (q=3): a=2.0, b=0.6, q=3 - Creates a (2,3) torus knot
- **(2,5) Torus Knot** (q=5): a=2.0, b=0.6, q=5
- **(2,7) Torus Knot** (q=7): a=2.0, b=0.6, q=7

You can also experiment with different a and b values to create various torus knot variations. Note that the implementation creates (2,q) torus knots where q is the twist parameter.

## Technical Details

All primitives are generated as triangle meshes using the `PrimitivesManager` class in `source/website/primitivesmanager.js`. The trefoil implementation uses:

- **Frenet frame calculation** for proper tube orientation along the curve
- **Triangle mesh generation** with proper vertex indexing
- **Automatic material assignment** with adjustable metalness, roughness, and opacity

## Reference

For more information about parametric knots and surfaces, see:
- [Trefoil Knot on Wikipedia](https://en.wikipedia.org/wiki/Trefoil_knot)
- [Parametric Equations](https://mathworld.wolfram.com/TrefoilKnot.html)
