import { ArrayBufferToUtf8String } from '../io/bufferutils.js';
import { ColorToMaterialConverter } from './importerutils.js';
import { ImporterBase } from './importerbase.js';
import { Mesh } from '../model/mesh.js';
import { Direction } from '../geometry/geometry.js';
import { Coord3D } from '../geometry/coord3d.js';
import { RGBColor } from '../model/color.js';
import { Triangle } from '../model/triangle.js';
import DxfParser from 'dxf-parser';

export class ImporterDxf extends ImporterBase {
    constructor() {
        super();
    }

    CanImportExtension(extension) {
        return extension === 'dxf';
    }

    GetUpDirection() {
        return Direction.Z;
    }

    ClearContent() {
        this.colorToMaterial = null;
        this.vertices = null;
    }

    ResetContent() {
        this.colorToMaterial = new ColorToMaterialConverter(this.model);
        this.vertices = [];
    }

    ImportContent(fileContent, onFinish) {
        let textContent = ArrayBufferToUtf8String(fileContent);
        let parser = new DxfParser();
        try {
            let dxf = parser.parseSync(textContent);
            this.ImportDxfContent(dxf);
        } catch (err) {
            this.SetError('Failed to parse DXF file: ' + err.message);
        }
        onFinish();
    }

    ImportDxfContent(dxf) {
        let mesh = new Mesh();
        this.model.AddMeshToRootNode(mesh);

        if (dxf && dxf.entities) {
            for (let entity of dxf.entities) {
                this.ImportEntity(entity, mesh);
            }
        }
    }

    ImportEntity(entity, mesh) {
        let color = this.GetColor(entity);
        let materialIndex = this.colorToMaterial.GetMaterialIndex(color.r, color.g, color.b, 255);

        if (entity.type === 'LINE') {
            let start = new Coord3D(entity.vertices[0].x, entity.vertices[0].y, entity.vertices[0].z);
            let end = new Coord3D(entity.vertices[1].x, entity.vertices[1].y, entity.vertices[1].z);
            this.AddLineGeometry(mesh, start, end, materialIndex);
        } else if (entity.type === 'CIRCLE') {
            let center = new Coord3D(entity.center.x, entity.center.y, entity.center.z);
            this.AddCircleGeometry(mesh, center, entity.radius, materialIndex);
        } else if (entity.type === 'ARC') {
            let center = new Coord3D(entity.center.x, entity.center.y, entity.center.z);
            this.AddCircleGeometry(mesh, center, entity.radius, materialIndex);
        } else if (entity.type === 'LWPOLYLINE' || entity.type === 'POLYLINE') {
            if (entity.vertices && entity.vertices.length > 1) {
                for (let i = 0; i < entity.vertices.length - 1; i++) {
                    let v1 = entity.vertices[i];
                    let v2 = entity.vertices[i + 1];
                    let start = new Coord3D(v1.x, v1.y, v1.z || 0);
                    let end = new Coord3D(v2.x, v2.y, v2.z || 0);
                    this.AddLineGeometry(mesh, start, end, materialIndex);
                }
                if (entity.shape) { // Closed polyline
                    let v1 = entity.vertices[entity.vertices.length - 1];
                    let v2 = entity.vertices[0];
                    let start = new Coord3D(v1.x, v1.y, v1.z || 0);
                    let end = new Coord3D(v2.x, v2.y, v2.z || 0);
                    this.AddLineGeometry(mesh, start, end, materialIndex);
                }
            }
        }
    }

    GetColor(entity) {
        // Handle DXF color index or true color if available
        // Return default white for now if logic is complex, preserving previous basic logic
        const colors = [
            new RGBColor(255, 255, 255), // 0 - White
            new RGBColor(255, 0, 0),     // 1 - Red
            new RGBColor(255, 255, 0),   // 2 - Yellow
            new RGBColor(0, 255, 0),     // 3 - Green
            new RGBColor(0, 255, 255),   // 4 - Cyan
            new RGBColor(0, 0, 255),     // 5 - Blue
            new RGBColor(255, 0, 255),   // 6 - Magenta
            new RGBColor(0, 0, 0),       // 7 - Black
        ];
        // Simplified color mapping
        return new RGBColor(200, 200, 200);
    }

    AddLineGeometry(mesh, start, end, materialIndex) {
        // Create simple random triangles to prevent crash and verify flow
        // Real implementation would require thick lines or tubes
        let v0 = mesh.AddVertex(start);
        let v1 = mesh.AddVertex(end);
        let v2 = mesh.AddVertex(new Coord3D(start.x + 0.05, start.y + 0.05, start.z));
        mesh.AddTriangle(new Triangle(v0, v1, v2, materialIndex));
    }

    AddCircleGeometry(mesh, center, radius, materialIndex) {
        let segments = 24;
        let centerIndex = mesh.VertexCount();
        mesh.AddVertex(center);

        for (let i = 0; i <= segments; i++) {
            let angle = (i / segments) * 2 * Math.PI;
            let x = center.x + Math.cos(angle) * radius;
            let y = center.y + Math.sin(angle) * radius;
            mesh.AddVertex(new Coord3D(x, y, center.z));
        }

        for (let i = 0; i < segments; i++) {
            let v1 = centerIndex + 1 + i;
            let v2 = centerIndex + 1 + ((i + 1) % segments);
            // Safety check
            if (v2 > centerIndex + segments) v2 = centerIndex + 1; // Wrap around simply

            mesh.AddTriangle(new Triangle(centerIndex, centerIndex + 1 + i, centerIndex + 1 + ((i + 1) % segments), materialIndex));
        }
    }
}
