import { ArrayBufferToUtf8String } from '../io/bufferutils.js';
import { ReadLines } from './importerutils.js';
import { ImporterBase } from './importerbase.js';
import { Mesh } from '../model/mesh.js';
import { Direction } from '../geometry/geometry.js';
import { Coord3D } from '../geometry/coord3d.js';
import { RGBColor } from '../model/color.js';

export class ImporterXyz extends ImporterBase
{
    constructor ()
    {
        super ();
    }

    CanImportExtension (extension)
    {
        return extension === 'xyz';
    }

    GetUpDirection ()
    {
        return Direction.Z;
    }

    ClearContent ()
    {
        this.mesh = null;
        this.pointSize = 0.1;
    }

    ResetContent ()
    {
        this.mesh = new Mesh ();
        this.model.AddMeshToRootNode (this.mesh);
        this.pointSize = 0.1;
    }

    ImportContent (fileContent, onFinish)
    {
        let textContent = ArrayBufferToUtf8String (fileContent);
        ReadLines (textContent, (line) => {
            if (!this.WasError ()) {
                this.ProcessLine (line);
            }
        });
        onFinish ();
    }

    ProcessLine (line)
    {
        line = line.trim ();
        if (line.length === 0 || line.startsWith ('#')) {
            return;
        }

        let parts = line.split (/\s+/);
        if (parts.length < 3) {
            return;
        }

        let x = parseFloat (parts[0]);
        let y = parseFloat (parts[1]);
        let z = parseFloat (parts[2]);

        if (isNaN (x) || isNaN (y) || isNaN (z)) {
            return;
        }

        let color = new RGBColor (200, 200, 200); // Default gray

        // Check if color information is provided
        if (parts.length >= 6) {
            let r = parseFloat (parts[3]);
            let g = parseFloat (parts[4]);
            let b = parseFloat (parts[5]);

            if (!isNaN (r) && !isNaN (g) && !isNaN (b)) {
                // Assume colors are in 0-1 range, convert to 0-255
                if (r <= 1.0 && g <= 1.0 && b <= 1.0) {
                    color = new RGBColor (Math.round (r * 255), Math.round (g * 255), Math.round (b * 255));
                } else {
                    color = new RGBColor (Math.round (r), Math.round (g), Math.round (b));
                }
            }
        }

        this.AddPointAsBox (new Coord3D (x, y, z), color);
    }

    AddPointAsBox (point, color)
    {
        let size = this.pointSize;
        let half = size / 2.0;

        // Add 8 vertices for a small cube
        let startIndex = this.mesh.VertexCount ();

        this.mesh.AddVertex (new Coord3D (point.x - half, point.y - half, point.z - half));
        this.mesh.AddVertex (new Coord3D (point.x + half, point.y - half, point.z - half));
        this.mesh.AddVertex (new Coord3D (point.x + half, point.y + half, point.z - half));
        this.mesh.AddVertex (new Coord3D (point.x - half, point.y + half, point.z - half));
        this.mesh.AddVertex (new Coord3D (point.x - half, point.y - half, point.z + half));
        this.mesh.AddVertex (new Coord3D (point.x + half, point.y - half, point.z + half));
        this.mesh.AddVertex (new Coord3D (point.x + half, point.y + half, point.z + half));
        this.mesh.AddVertex (new Coord3D (point.x - half, point.y + half, point.z + half));

        // Add 12 triangles for the cube faces
        let faces = [
            // Front face
            [0, 1, 2], [2, 3, 0],
            // Back face
            [4, 7, 6], [6, 5, 4],
            // Left face
            [0, 3, 7], [7, 4, 0],
            // Right face
            [1, 5, 6], [6, 2, 1],
            // Bottom face
            [0, 4, 5], [5, 1, 0],
            // Top face
            [3, 2, 6], [6, 7, 3]
        ];

        for (let face of faces) {
            this.mesh.AddTriangle ({
                v0: startIndex + face[0],
                v1: startIndex + face[1],
                v2: startIndex + face[2],
                SetMaterial: function(mat) { this.mat = mat; },
                GetMaterial: function() { return this.mat; }
            });
        }
    }
}
