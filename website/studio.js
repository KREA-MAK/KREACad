// Wait for OV to be loaded from o3dv.website.min.js
// This file should be loaded with defer, not as a module

// Get classes from global OV namespace
const { Viewer, NavigationMode, ProjectionMode, Coord3D, Model, Mesh, Triangle, RGBColor, RGBAColor, PhysicalMaterial, PhongMaterial } = window.OV || {};

// Debug: Check if OV is loaded
if (!window.OV) {
    console.error('OV global object not found! Make sure o3dv.website.min.js loads before studio.js');
}
if (!Viewer || !Model || !Mesh || !Triangle) {
    console.error('Required OV classes not found:', { Viewer, Model, Mesh, Triangle });
}

// Simple PrimitivesManager subset for studio (inline to avoid module imports)
// Full version is in source/website/primitivesmanager.js but we need a lightweight standalone version
class StudioPrimitivesManager {
    constructor(viewer, model) {
        this.viewer = viewer;
        this.model = model;
        this.selectedObject = null;
    }

    CreatePhysicalMaterial() {
        const mat = new PhysicalMaterial();
        mat.color = new RGBColor(200, 200, 200);
        mat.metalness = 0.0;
        mat.roughness = 1.0;
        mat.opacity = 1.0;
        return mat;
    }

    CreatePrimitive(type) {
        const mesh = new Mesh();
        mesh.SetName(type);

        // Basic primitive generation (simplified)
        if (type === 'cube') {
            this.generateCube(mesh);
        } else if (type === 'sphere') {
            this.generateSphere(mesh);
        } else if (type === 'cylinder') {
            this.generateCylinder(mesh);
        } else if (type === 'cone') {
            this.generateCone(mesh);
        } else if (type === 'plane') {
            this.generatePlane(mesh);
        }

        const matIndex = this.model.AddMaterial(this.GenerateMaterial ? this.GenerateMaterial() : this.CreatePhysicalMaterial());
        for (let i = 0; i < mesh.TriangleCount(); i++) {
            mesh.GetTriangle(i).SetMaterial(matIndex);
        }

        this.model.AddMeshToRootNode(mesh);
        this.viewer.SetModel(this.model);
    }

    generateCube(mesh) {
        const s = 1.0;
        const v = [
            mesh.AddVertex(new Coord3D(-s, -s, -s)),
            mesh.AddVertex(new Coord3D( s, -s, -s)),
            mesh.AddVertex(new Coord3D( s,  s, -s)),
            mesh.AddVertex(new Coord3D(-s,  s, -s)),
            mesh.AddVertex(new Coord3D(-s, -s,  s)),
            mesh.AddVertex(new Coord3D( s, -s,  s)),
            mesh.AddVertex(new Coord3D( s,  s,  s)),
            mesh.AddVertex(new Coord3D(-s,  s,  s))
        ];
        const faces = [
            [0,1,2,3], [4,7,6,5], [0,4,5,1], [1,5,6,2], [2,6,7,3], [3,7,4,0]
        ];
        faces.forEach(f => {
            mesh.AddTriangle(new Triangle(f[0], f[1], f[2]));
            mesh.AddTriangle(new Triangle(f[0], f[2], f[3]));
        });
    }

    generateSphere(mesh) {
        const radius = 1.0;
        const segments = 32;
        const rings = 16;
        for (let ring = 0; ring <= rings; ring++) {
            const phi = Math.PI * ring / rings;
            for (let seg = 0; seg <= segments; seg++) {
                const theta = 2 * Math.PI * seg / segments;
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                mesh.AddVertex(new Coord3D(x, y, z));
            }
        }
        for (let ring = 0; ring < rings; ring++) {
            for (let seg = 0; seg < segments; seg++) {
                const a = ring * (segments + 1) + seg;
                const b = a + segments + 1;
                mesh.AddTriangle(new Triangle(a, b, a + 1));
                mesh.AddTriangle(new Triangle(b, b + 1, a + 1));
            }
        }
    }

    generateCylinder(mesh) {
        const radius = 1.0;
        const height = 2.0;
        const segments = 32;
        const halfH = height / 2;

        // Top and bottom centers
        const topCenter = mesh.AddVertex(new Coord3D(0, halfH, 0));
        const bottomCenter = mesh.AddVertex(new Coord3D(0, -halfH, 0));

        // Side vertices
        const topVerts = [];
        const bottomVerts = [];
        for (let i = 0; i <= segments; i++) {
            const angle = (2 * Math.PI * i) / segments;
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            topVerts.push(mesh.AddVertex(new Coord3D(x, halfH, z)));
            bottomVerts.push(mesh.AddVertex(new Coord3D(x, -halfH, z)));
        }

        // Caps and sides
        for (let i = 0; i < segments; i++) {
            mesh.AddTriangle(new Triangle(topCenter, topVerts[i], topVerts[i + 1]));
            mesh.AddTriangle(new Triangle(bottomCenter, bottomVerts[i + 1], bottomVerts[i]));
            mesh.AddTriangle(new Triangle(bottomVerts[i], topVerts[i], topVerts[i + 1]));
            mesh.AddTriangle(new Triangle(bottomVerts[i], topVerts[i + 1], bottomVerts[i + 1]));
        }
    }

    generateCone(mesh) {
        const radius = 1.0;
        const height = 2.0;
        const segments = 32;

        const apex = mesh.AddVertex(new Coord3D(0, height / 2, 0));
        const baseCenter = mesh.AddVertex(new Coord3D(0, -height / 2, 0));

        const baseVerts = [];
        for (let i = 0; i <= segments; i++) {
            const angle = (2 * Math.PI * i) / segments;
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            baseVerts.push(mesh.AddVertex(new Coord3D(x, -height / 2, z)));
        }

        for (let i = 0; i < segments; i++) {
            mesh.AddTriangle(new Triangle(apex, baseVerts[i], baseVerts[i + 1]));
            mesh.AddTriangle(new Triangle(baseCenter, baseVerts[i + 1], baseVerts[i]));
        }
    }

    generatePlane(mesh) {
        const s = 2.0;
        const v0 = mesh.AddVertex(new Coord3D(-s, 0, -s));
        const v1 = mesh.AddVertex(new Coord3D( s, 0, -s));
        const v2 = mesh.AddVertex(new Coord3D( s, 0,  s));
        const v3 = mesh.AddVertex(new Coord3D(-s, 0,  s));
        mesh.AddTriangle(new Triangle(v0, v1, v2));
        mesh.AddTriangle(new Triangle(v0, v2, v3));
    }

    SelectObject() {}
    DeselectObject() {}
}

// Simple helper to create a checker grid texture via canvas
function createGrid (canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    const size = 48;
    ctx.fillStyle = '#0f1115';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h / size + 2; y++) {
        for (let x = 0; x < w / size + 2; x++) {
            ctx.fillStyle = ((x + y) % 2 === 0) ? '#141a20' : '#182029';
            ctx.fillRect(x * size, y * size, size, size);
        }
    }
}

class PrimitiveStudio {
    constructor () {
        this.canvas = document.getElementById('viewer_canvas');
        this.gridCanvas = document.getElementById('grid_canvas');
        createGrid(this.gridCanvas);

        this.viewer = new Viewer();
        this.viewer.Init(this.canvas);
        this.viewer.SetBackgroundColor(new RGBAColor(18, 20, 26, 255));
        this.viewer.SetNavigationMode(NavigationMode.FixedUpVector);
        this.viewer.SetUpVector(0, 1, 0, false);

        this.model = new Model();
        this.primitivesManager = new StudioPrimitivesManager(this.viewer, this.model);

        // Enhance selection: keep original color, overlay ghost (simple re-color approach for now)
        const originalSelect = this.primitivesManager.SelectObject.bind(this.primitivesManager);
        this.primitivesManager.SelectObject = (obj) => {
            originalSelect(obj);
            // Slight brighten
            const c = obj.material.color;
            obj.material.color = new RGBColor(Math.min(c.r + 30, 255), Math.min(c.g + 30, 255), Math.min(c.b + 30, 255));
            this.viewer.SetModel(this.model);
        };
        const originalDeselect = this.primitivesManager.DeselectObject.bind(this.primitivesManager);
        this.primitivesManager.DeselectObject = () => {
            originalDeselect();
        };

        this.primitivesManager.CreatePhysicalMaterial = () => {
            const mat = new PhysicalMaterial();
            mat.color = new RGBColor(Math.random() * 255, Math.random() * 255, Math.random() * 255);
            mat.metalness = parseFloat(document.getElementById('metalness_slider').value);
            mat.roughness = parseFloat(document.getElementById('roughness_slider').value);
            mat.opacity = parseFloat(document.getElementById('opacity_slider').value);
            return mat;
        };

    this.initLights();
    this.initGround();
    this.initUI();

    // Check URL parameters to determine if primitives bar should be shown
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    // After ground creation, fit camera if we have any mesh
    this.fitScene();
        // No longer auto-populate primitive_bar; handled by static HTML in toolbar

        // Show the primitives bar by default
        const primitivesBar = document.getElementById('studio_primitives_bar');
        if (primitivesBar) {
            primitivesBar.style.display = 'flex';
        }

        // Only add default cube and show primitives if in 'new' mode
        if (mode === 'new') {
            // Add a default cube so the scene isn't empty/dark
            if (this.model.MeshCount() === 0) {
                this.primitivesManager.GenerateMaterial = () => this.primitivesManager.CreatePhysicalMaterial();
                this.primitivesManager.CreatePrimitive('cube');
                this.viewer.SetModel(this.model);
                this.focusOnModel();
            }
        }

        this.initDebugOverlay();
        this.bindResize();
    }

    initLights () {
        // Since engine doesn't yet support dynamic light sources here, emulate brightness
        // by slightly brighter background and relying on material roughness/metalness sliders.
        this.viewer.SetBackgroundColor(new RGBColor(28, 30, 36));
    }

    initGround () {
        const mesh = new Mesh();
        const size = 40;
        mesh.AddVertex(new Coord3D(-size, -2, -size));
        mesh.AddVertex(new Coord3D(size, -2, -size));
        mesh.AddVertex(new Coord3D(size, -2, size));
        mesh.AddVertex(new Coord3D(-size, -2, size));
        mesh.AddTriangle(0, 1, 2);
        mesh.AddTriangle(0, 2, 3);
        const mat = new PhysicalMaterial();
        // Slight gradient imitation by random subtle variation later if needed
        mat.color = new RGBColor(110, 115, 125); // a bit lighter for visibility
        mat.metalness = 0.0;
        mat.roughness = 1.0;
        const meshIndex = this.model.AddMesh(mesh);
        const matIndex = this.model.AddMaterial(mat);
        for (let i = 0; i < mesh.TriangleCount(); i++) {
            mesh.GetTriangle(i).SetMaterial(matIndex);
        }
        this.viewer.SetModel(this.model);
    }

    initUI () {
        // No longer populate primitive_bar in param_panel; handled by static HTML in toolbar

        document.getElementById('metalness_slider').addEventListener('input', (e) => {
            document.getElementById('metalness_val').textContent = parseFloat(e.target.value).toFixed(2);
            this.updateSelectedMaterial();
        });
        document.getElementById('roughness_slider').addEventListener('input', (e) => {
            document.getElementById('roughness_val').textContent = parseFloat(e.target.value).toFixed(2);
            this.updateSelectedMaterial();
        });
        document.getElementById('opacity_slider').addEventListener('input', (e) => {
            document.getElementById('opacity_val').textContent = parseFloat(e.target.value).toFixed(2);
            this.updateSelectedMaterial();
        });

        const genBtn = document.getElementById('generate_trefoil');
        if (genBtn) {
            genBtn.addEventListener('click', () => this.generateTrefoilFromUI());
        }

        document.getElementById('reset_cam_btn').addEventListener('click', () => {
            this.viewer.camera.OrbitToDefault();
        });
        document.getElementById('clear_btn').addEventListener('click', () => {
            this.model = new Model();
            this.primitivesManager.model = this.model;
            this.viewer.SetModel(this.model);
        });
        document.getElementById('back_btn').addEventListener('click', () => {
            // Prefer history navigation to preserve previous page state/header.
            const ref = document.referrer;
            if ((ref && ref.indexOf('index.html') !== -1) || window.history.length > 1) {
                try {
                    window.history.back();
                    return;
                } catch (e) { /* fall through */ }
            }
            // Fallback if no history (opened directly) -> go to index
            window.location.href = './index.html';
        });

        // Inline primitives bar wiring (toolbar)
        const toolbarButtons = document.querySelectorAll('#studio_primitives_bar .prim_icon_btn');
        toolbarButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-prim');
                this.createPrimitive(type, btn);
                toolbarButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    createPrimitive (type, btn) {
        this.primitivesManager.GenerateMaterial = () => this.primitivesManager.CreatePhysicalMaterial();
        this.primitivesManager.CreatePrimitive(type);
    document.querySelectorAll('#studio_primitives_bar .prim_icon_btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
        this.focusOnModel();
    }

    updateSelectedMaterial () {
        const sel = this.primitivesManager.selectedObject;
        if (!sel) return;
        const mat = sel.material;
        if (mat) {
            mat.metalness = parseFloat(document.getElementById('metalness_slider').value);
            mat.roughness = parseFloat(document.getElementById('roughness_slider').value);
            mat.opacity = parseFloat(document.getElementById('opacity_slider').value);
            this.viewer.SetModel(this.model);
        }
    }

    generateTrefoilFromUI () {
        const a = parseFloat(document.getElementById('trefoil_a').value);
        const b = parseFloat(document.getElementById('trefoil_b').value);
        const q = parseInt(document.getElementById('trefoil_q').value, 10);
        const tube = parseFloat(document.getElementById('trefoil_tube').value);
        const segU = parseInt(document.getElementById('trefoil_seg_u').value, 10);
        const segV = parseInt(document.getElementById('trefoil_seg_v').value, 10);
        this.createTrefoil(a, b, q, tube, segU, segV);
    }

    // Parametric center curve
    trefoilPoint (a, b, q, u) {
        return new Coord3D(
            (a + b * Math.cos(q * u)) * Math.cos(u),
            (a + b * Math.cos(q * u)) * Math.sin(u),
            b * Math.sin(q * u)
        );
    }

    createTrefoil (a, b, q, tube, segU, segV) {
        const mesh = new Mesh();
        const points = [];
        for (let i = 0; i <= segU; i++) {
            const u = (i / segU) * Math.PI * 2.0;
            points.push(this.trefoilPoint(a, b, q, u));
        }

        // Approximate tangent and build frame (simple method)
        const frames = [];
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const pNext = points[(i + 1) % points.length];
            const tx = pNext.x - p.x;
            const ty = pNext.y - p.y;
            const tz = pNext.z - p.z;
            const len = Math.max(Math.hypot(tx, ty, tz), 1e-6);
            const tnx = tx / len, tny = ty / len, tnz = tz / len;
            // Choose a helper up vector
            const ux = 0, uy = 0, uz = 1;
            // Normal = tangent x up
            let nx = tny * uz - tnz * uy;
            let ny = tnz * ux - tnx * uz;
            let nz = tnx * uy - tny * ux;
            let nlen = Math.max(Math.hypot(nx, ny, nz), 1e-6);
            nx /= nlen; ny /= nlen; nz /= nlen;
            // Binormal = tangent x normal
            let bx = tny * nz - tnz * ny;
            let by = tnz * nx - tnx * nz;
            let bz = tnx * ny - tny * nx;
            let blen = Math.max(Math.hypot(bx, by, bz), 1e-6);
            bx /= blen; by /= blen; bz /= blen;
            frames.push({ p, t: { x: tnx, y: tny, z: tnz }, n: { x: nx, y: ny, z: nz }, b: { x: bx, y: by, z: bz } });
        }

        // Create tube vertices
        const ringVerts = [];
        for (let i = 0; i < frames.length; i++) {
            const f = frames[i];
            for (let j = 0; j <= segV; j++) {
                const v = (j / segV) * Math.PI * 2.0;
                const cx = Math.cos(v) * tube;
                const cy = Math.sin(v) * tube;
                const vx = f.p.x + f.n.x * cx + f.b.x * cy;
                const vy = f.p.y + f.n.y * cx + f.b.y * cy;
                const vz = f.p.z + f.n.z * cx + f.b.z * cy;
                mesh.AddVertex(new Coord3D(vx, vy, vz));
                ringVerts.push({ i, j });
            }
        }

        const ringSize = segV + 1;
        for (let i = 0; i < frames.length - 1; i++) {
            for (let j = 0; j < segV; j++) {
                const a0 = i * ringSize + j;
                const a1 = (i + 1) * ringSize + j;
                const a2 = (i + 1) * ringSize + (j + 1);
                const a3 = i * ringSize + (j + 1);
                mesh.AddTriangle(a0, a1, a2);
                mesh.AddTriangle(a0, a2, a3);
            }
        }

        const mat = new PhysicalMaterial();
        mat.color = new RGBColor(200, 160, 80);
        mat.metalness = parseFloat(document.getElementById('metalness_slider').value);
        mat.roughness = parseFloat(document.getElementById('roughness_slider').value);
        mat.opacity = parseFloat(document.getElementById('opacity_slider').value);

        const meshIndex = this.model.AddMesh(mesh);
        const matIndex = this.model.AddMaterial(mat);
        for (let i = 0; i < mesh.TriangleCount(); i++) {
            mesh.GetTriangle(i).SetMaterial(matIndex);
        }

        this.viewer.SetModel(this.model);
        this.focusOnModel();
    }

    bindResize () {
        window.addEventListener('resize', () => {
            createGrid(this.gridCanvas);
            this.viewer.Resize(window.innerWidth, window.innerHeight);
        });
        this.viewer.Resize(window.innerWidth, window.innerHeight);
    }

    // Fallback in case original initUI didn't run or DOM race
    // fallbackPopulateBar removed; no longer needed

    fitScene () {
        // Try to fit camera to model if there is at least one mesh
        if (this.model.MeshCount() > 0) {
            const sphere = this.viewer.GetBoundingSphere(() => true);
            if (sphere && sphere.radius > 0) {
                this.viewer.FitSphereToWindow(sphere, false);
                this.viewer.Render();
            }
        }
    }

    // More immediate camera focus after any object addition
    focusOnModel () {
        const sphere = this.viewer.GetBoundingSphere(() => true);
        if (sphere && sphere.radius > 0) {
            this.viewer.FitSphereToWindow(sphere, false);
        }
    }

    initDebugOverlay () {
        const overlay = document.createElement('div');
        overlay.id = 'studio_debug_overlay';
        overlay.style.position = 'absolute';
        overlay.style.bottom = '8px';
        overlay.style.right = '10px';
        overlay.style.background = 'rgba(0,0,0,0.45)';
        overlay.style.font = '11px monospace';
        overlay.style.color = '#8fd1ff';
        overlay.style.padding = '4px 6px';
        overlay.style.border = '1px solid #2e3945';
        overlay.style.borderRadius = '4px';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '20';
        document.getElementById('studio_root').appendChild(overlay);
        const update = () => {
            const meshCount = this.model.MeshCount();
            overlay.textContent = `Meshes:${meshCount}`;
        };
        setInterval(update, 1000);
        update();
        // Toggle with F2
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F2') {
                overlay.style.display = (overlay.style.display === 'none') ? 'block' : 'none';
            }
        });
    }
}

window.addEventListener('load', () => {
    const studio = new PrimitiveStudio();
    window.__kreacadStudio = studio; // expose for debugging
});
