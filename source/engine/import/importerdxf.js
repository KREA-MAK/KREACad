import { ArrayBufferToUtf8String } from '../io/bufferutils.js';
import { ColorToMaterialConverter } from './importerutils.js';
import { ImporterBase } from './importerbase.js';
import { Mesh } from '../model/mesh.js';
import { Direction } from '../geometry/geometry.js';
import { Coord3D } from '../geometry/coord3d.js';
import { RGBColor } from '../model/color.js';

// Simple DXF/DWG importer for basic 2D/3D entities
export class ImporterDxf extends ImporterBase
{
    constructor ()
    {
        super ();
    }

    CanImportExtension (extension)
    {
        return extension === 'dxf' || extension === 'dwg';
    }

    GetUpDirection ()
    {
        return Direction.Z;
    }

    ClearContent ()
    {
        this.colorToMaterial = null;
        this.vertices = null;
        this.currentLayer = null;
        this.currentColor = null;
    }

    ResetContent ()
    {
        this.colorToMaterial = new ColorToMaterialConverter (this.model);
        this.vertices = [];
        this.currentLayer = 'default';
        this.currentColor = new RGBColor (255, 255, 255);
    }

    ImportContent (fileContent, onFinish)
    {
        if (this.extension === 'dwg') {
            this.SetError ('DWG format requires specialized parser. Please convert to DXF format.');
            onFinish ();
            return;
        }

        let textContent = ArrayBufferToUtf8String (fileContent);
        this.ParseDxf (textContent);
        onFinish ();
    }

    ParseDxf (content)
    {
        let lines = content.split ('\n');
        let mesh = new Mesh ();
        this.model.AddMeshToRootNode (mesh);

        for (let i = 0; i < lines.length - 1; i += 2) {
            let code = parseInt (lines[i].trim ());
            let value = lines[i + 1].trim ();

            switch (code) {
                case 0: // Entity type
                    if (value === 'LINE') {
                        i = this.ParseLine (lines, i, mesh);
                    } else if (value === 'CIRCLE') {
                        i = this.ParseCircle (lines, i, mesh);
                    } else if (value === 'POLYLINE') {
                        i = this.ParsePolyline (lines, i, mesh);
                    }
                    break;
                case 8: // Layer name
                    this.currentLayer = value;
                    break;
                case 62: // Color number
                    this.currentColor = this.GetColorFromIndex (parseInt (value));
                    break;
            }
        }
    }

    ParseLine (lines, startIndex, mesh)
    {
        let x1 = 0, y1 = 0, z1 = 0;
        let x2 = 0, y2 = 0, z2 = 0;

        for (let i = startIndex + 2; i < lines.length - 1; i += 2) {
            let code = parseInt (lines[i].trim ());
            let value = parseFloat (lines[i + 1].trim ());

            if (code === 0) return i - 2; // Next entity

            switch (code) {
                case 10: x1 = value; break;
                case 20: y1 = value; break;
                case 30: z1 = value; break;
                case 11: x2 = value; break;
                case 21: y2 = value; break;
                case 31: z2 = value; break;
            }
        }

        // Create line as thin cylinder
        let materialIndex = this.colorToMaterial.GetMaterialIndex (this.currentColor.r, this.currentColor.g, this.currentColor.b, 255);
        this.AddLineGeometry (mesh, new Coord3D (x1, y1, z1), new Coord3D (x2, y2, z2), materialIndex);

        return lines.length;
    }

    ParseCircle (lines, startIndex, mesh)
    {
        let centerX = 0, centerY = 0, centerZ = 0, radius = 1;

        for (let i = startIndex + 2; i < lines.length - 1; i += 2) {
            let code = parseInt (lines[i].trim ());
            let value = parseFloat (lines[i + 1].trim ());

            if (code === 0) return i - 2;

            switch (code) {
                case 10: centerX = value; break;
                case 20: centerY = value; break;
                case 30: centerZ = value; break;
                case 40: radius = value; break;
            }
        }

        let materialIndex = this.colorToMaterial.GetMaterialIndex (this.currentColor.r, this.currentColor.g, this.currentColor.b, 255);
        this.AddCircleGeometry (mesh, new Coord3D (centerX, centerY, centerZ), radius, materialIndex);

        return lines.length;
    }

    ParsePolyline (lines, startIndex, mesh)
    {
        // Basic polyline parsing - simplified
        return startIndex + 2;
    }

    AddLineGeometry (mesh, start, end, materialIndex)
    {
        // Create simple line representation as very thin cylinder
        let segments = 8;
        let height = start.DistanceTo (end);
        let radius = 0.01; // Very thin line

        // Add vertices for cylinder
        let startIndex = mesh.VertexCount ();

        for (let i = 0; i <= segments; i++) {
            let angle = (i / segments) * 2 * Math.PI;
            let x = Math.cos (angle) * radius;
            let y = Math.sin (angle) * radius;

            mesh.AddVertex (new Coord3D (start.x + x, start.y + y, start.z));
            mesh.AddVertex (new Coord3D (end.x + x, end.y + y, end.z + height));
        }

        // Add triangles
        for (let i = 0; i < segments; i++) {
            let curr = startIndex + i * 2;
            let next = startIndex + ((i + 1) % segments) * 2;

            mesh.AddTriangle ({
                v0: curr, v1: curr + 1, v2: next,
                SetMaterial: function(mat) { this.mat = mat; },
                GetMaterial: function() { return this.mat; }
            });
            mesh.GetTriangle (mesh.TriangleCount () - 1).SetMaterial (materialIndex);

            mesh.AddTriangle ({
                v0: next, v1: curr + 1, v2: next + 1,
                SetMaterial: function(mat) { this.mat = mat; },
                GetMaterial: function() { return this.mat; }
            });
            mesh.GetTriangle (mesh.TriangleCount () - 1).SetMaterial (materialIndex);
        }
    }

    AddCircleGeometry (mesh, center, radius, materialIndex)
    {
        let segments = 32;
        let centerIndex = mesh.VertexCount ();
        mesh.AddVertex (center);

        for (let i = 0; i <= segments; i++) {
            let angle = (i / segments) * 2 * Math.PI;
            let x = center.x + Math.cos (angle) * radius;
            let y = center.y + Math.sin (angle) * radius;
            mesh.AddVertex (new Coord3D (x, y, center.z));
        }

        for (let i = 0; i < segments; i++) {
            mesh.AddTriangle ({
                v0: centerIndex,
                v1: centerIndex + 1 + i,
                v2: centerIndex + 1 + ((i + 1) % segments),
                SetMaterial: function(mat) { this.mat = mat; },
                GetMaterial: function() { return this.mat; }
            });
            mesh.GetTriangle (mesh.TriangleCount () - 1).SetMaterial (materialIndex);
        }
    }

    GetColorFromIndex (colorIndex)
    {
        // Standard AutoCAD color palette (simplified)
        const colors = [
            new RGBColor (255, 255, 255), // 0 - White
            new RGBColor (255, 0, 0),     // 1 - Red
            new RGBColor (255, 255, 0),   // 2 - Yellow
            new RGBColor (0, 255, 0),     // 3 - Green
            new RGBColor (0, 255, 255),   // 4 - Cyan
            new RGBColor (0, 0, 255),     // 5 - Blue
            new RGBColor (255, 0, 255),   // 6 - Magenta
            new RGBColor (0, 0, 0),       // 7 - Black
        ];

        if (colorIndex >= 0 && colorIndex < colors.length) {
            return colors[colorIndex];
        }
        return new RGBColor (255, 255, 255); // Default white
    }
}
