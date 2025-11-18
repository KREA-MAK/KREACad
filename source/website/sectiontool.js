import { AddDiv, ClearDomElement } from '../engine/viewer/domutils.js';
import { Loc } from '../engine/core/localization.js';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

export class SectionTool
{
    constructor (viewer, settings)
    {
        this.viewer = viewer;
        this.settings = settings;
        this.active = false;
        this.button = null;
        
        // Section plane properties
        this.sectionPlane = null;
        this.sectionHelper = null;
        this.transformControls = null;
        this.clippingEnabled = false;
        
        // Transform values
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        
        // Panel UI
        this.panelDiv = null;
    }

    IsActive ()
    {
        return this.active;
    }

    SetButton (button)
    {
        this.button = button;
    }

    SetActive (active)
    {
        if (this.active === active) {
            return;
        }
        this.active = active;
        this.button.SetSelected (active);
        
        if (this.active) {
            this.Activate ();
            this.CreatePanel (document.body);
            this.ShowPanel (true);
            this.UpdatePanel ();
            this.Resize ();
        } else {
            this.Deactivate ();
            if (this.panelDiv) {
                this.panelDiv.remove ();
                this.panelDiv = null;
            }
        }
    }

    Activate ()
    {
        // Create section plane at the center of the model
        let boundingSphere = this.viewer.GetBoundingSphere (() => true);
        if (!boundingSphere) {
            return;
        }

        // Create clipping plane
        this.sectionPlane = new THREE.Plane (new THREE.Vector3 (0, 0, 1), 0);
        this.position.x = boundingSphere.center.x;
        this.position.y = boundingSphere.center.y;
        this.position.z = boundingSphere.center.z;

        // Create visual helper for the plane
        let size = boundingSphere.radius * 2;
        this.sectionHelper = new THREE.PlaneHelper (this.sectionPlane, size, 0xff0000);
        this.viewer.AddExtraObject (this.sectionHelper);

        // Create transform controls
        this.transformControls = new TransformControls (
            this.viewer.camera, 
            this.viewer.renderer.domElement
        );
        
        this.transformControls.attach (this.sectionHelper);
        this.transformControls.setMode ('translate');
        this.transformControls.setSize (0.8);
        
        this.viewer.AddExtraObject (this.transformControls);

        // Update clipping on transform
        this.transformControls.addEventListener ('change', () => {
            this.UpdateSectionPlane ();
            this.UpdatePanel ();
            this.viewer.Render ();
        });

        // Disable navigation during transform
        this.transformControls.addEventListener ('dragging-changed', (event) => {
            this.viewer.navigation.EnableControls (!event.value);
        });

        this.UpdateSectionPlane ();
        this.viewer.Render ();
    }

    Deactivate ()
    {
        // Remove transform controls
        if (this.transformControls) {
            this.transformControls.detach ();
            if (this.viewer.extraModel && this.viewer.extraModel.rootObject) {
                this.viewer.extraModel.rootObject.remove (this.transformControls);
            }
            this.transformControls.dispose ();
            this.transformControls = null;
        }

        // Remove section helper
        if (this.sectionHelper) {
            if (this.viewer.extraModel && this.viewer.extraModel.rootObject) {
                this.viewer.extraModel.rootObject.remove (this.sectionHelper);
            }
            this.sectionHelper = null;
        }

        // Disable clipping
        this.DisableClipping ();
        this.sectionPlane = null;
        
        this.viewer.Render ();
    }

    UpdateSectionPlane ()
    {
        if (!this.sectionHelper || !this.sectionPlane) {
            return;
        }

        // Update position from helper
        this.position.x = this.sectionHelper.position.x;
        this.position.y = this.sectionHelper.position.y;
        this.position.z = this.sectionHelper.position.z;

        // Update rotation from helper
        this.rotation.x = this.sectionHelper.rotation.x;
        this.rotation.y = this.sectionHelper.rotation.y;
        this.rotation.z = this.sectionHelper.rotation.z;

        // Update the plane equation
        let normal = new THREE.Vector3 (0, 0, 1);
        normal.applyEuler (this.sectionHelper.rotation);
        
        this.sectionPlane.setFromNormalAndCoplanarPoint (
            normal,
            this.sectionHelper.position
        );

        // Apply clipping if enabled
        if (this.clippingEnabled) {
            this.ApplyClipping ();
        }
    }

    EnableClipping ()
    {
        this.clippingEnabled = true;
        this.ApplyClipping ();
        this.viewer.Render ();
    }

    DisableClipping ()
    {
        this.clippingEnabled = false;
        this.viewer.renderer.clippingPlanes = [];
        this.viewer.Render ();
    }

    ApplyClipping ()
    {
        if (!this.sectionPlane) {
            return;
        }

        this.viewer.renderer.clippingPlanes = [this.sectionPlane];
        this.viewer.renderer.localClippingEnabled = true;
    }

    SetTransformMode (mode)
    {
        if (this.transformControls) {
            this.transformControls.setMode (mode);
            this.viewer.Render ();
        }
    }

    SetPosition (x, y, z)
    {
        if (this.sectionHelper) {
            this.sectionHelper.position.set (x, y, z);
            this.UpdateSectionPlane ();
            this.viewer.Render ();
        }
    }

    SetRotation (x, y, z)
    {
        if (this.sectionHelper) {
            this.sectionHelper.rotation.set (x, y, z);
            this.UpdateSectionPlane ();
            this.viewer.Render ();
        }
    }

    CreatePanel (parentDiv)
    {
        this.panelDiv = AddDiv (parentDiv, 'ov_measure_panel');
        this.panelDiv.style.display = 'none';
        
        let titleDiv = AddDiv (this.panelDiv, 'ov_measure_panel_title');
        titleDiv.innerHTML = Loc ('Section View');
        
        let contentDiv = AddDiv (this.panelDiv, 'ov_measure_panel_content');
        
        // Clipping toggle
        let clippingRow = AddDiv (contentDiv, 'ov_measure_panel_row');
        let clippingLabel = document.createElement ('label');
        clippingLabel.innerHTML = Loc ('Enable Clipping') + ': ';
        clippingLabel.style.marginRight = '8px';
        let clippingCheckbox = document.createElement ('input');
        clippingCheckbox.type = 'checkbox';
        clippingCheckbox.checked = this.clippingEnabled;
        clippingCheckbox.addEventListener ('change', () => {
            if (clippingCheckbox.checked) {
                this.EnableClipping ();
            } else {
                this.DisableClipping ();
            }
        });
        clippingRow.appendChild (clippingLabel);
        clippingRow.appendChild (clippingCheckbox);
        
        // Transform mode selector
        let modeRow = AddDiv (contentDiv, 'ov_measure_panel_row');
        let modeLabel = document.createElement ('label');
        modeLabel.innerHTML = Loc ('Mode') + ': ';
        modeLabel.style.marginRight = '8px';
        let modeSelect = document.createElement ('select');
        
        let translateOption = document.createElement ('option');
        translateOption.value = 'translate';
        translateOption.innerHTML = Loc ('Translate (XYZ)');
        modeSelect.appendChild (translateOption);
        
        let rotateOption = document.createElement ('option');
        rotateOption.value = 'rotate';
        rotateOption.innerHTML = Loc ('Rotate (ABC)');
        modeSelect.appendChild (rotateOption);
        
        modeSelect.addEventListener ('change', () => {
            this.SetTransformMode (modeSelect.value);
        });
        modeRow.appendChild (modeLabel);
        modeRow.appendChild (modeSelect);
        
        // Position controls
        this.CreateAxisControl (contentDiv, 'Position X', 'x', 'position');
        this.CreateAxisControl (contentDiv, 'Position Y', 'y', 'position');
        this.CreateAxisControl (contentDiv, 'Position Z', 'z', 'position');
        
        // Rotation controls
        this.CreateAxisControl (contentDiv, 'Rotation A (X)', 'x', 'rotation');
        this.CreateAxisControl (contentDiv, 'Rotation B (Y)', 'y', 'rotation');
        this.CreateAxisControl (contentDiv, 'Rotation C (Z)', 'z', 'rotation');
        
        return this.panelDiv;
    }

    CreateAxisControl (parentDiv, label, axis, type)
    {
        let row = AddDiv (parentDiv, 'ov_measure_panel_row');
        let labelElem = document.createElement ('label');
        labelElem.innerHTML = Loc (label) + ': ';
        labelElem.style.marginRight = '8px';
        labelElem.style.minWidth = '80px';
        labelElem.style.display = 'inline-block';
        
        let input = document.createElement ('input');
        input.type = 'number';
        input.step = type === 'rotation' ? '0.1' : '1';
        input.style.width = '80px';
        
        input.addEventListener ('change', () => {
            let value = parseFloat (input.value) || 0;
            if (type === 'position') {
                let newPos = { ...this.position };
                newPos[axis] = value;
                this.SetPosition (newPos.x, newPos.y, newPos.z);
            } else {
                let newRot = { ...this.rotation };
                newRot[axis] = value * (Math.PI / 180); // Convert degrees to radians
                this.SetRotation (newRot.x, newRot.y, newRot.z);
            }
        });
        
        row.appendChild (labelElem);
        row.appendChild (input);
        
        // Store reference for updates
        if (!this.controlInputs) {
            this.controlInputs = {};
        }
        this.controlInputs[type + '_' + axis] = input;
    }

    UpdatePanel ()
    {
        if (!this.controlInputs) {
            return;
        }

        // Update position inputs
        if (this.controlInputs.position_x) {
            this.controlInputs.position_x.value = this.position.x.toFixed (2);
        }
        if (this.controlInputs.position_y) {
            this.controlInputs.position_y.value = this.position.y.toFixed (2);
        }
        if (this.controlInputs.position_z) {
            this.controlInputs.position_z.value = this.position.z.toFixed (2);
        }

        // Update rotation inputs (convert radians to degrees)
        if (this.controlInputs.rotation_x) {
            this.controlInputs.rotation_x.value = (this.rotation.x * 180 / Math.PI).toFixed (2);
        }
        if (this.controlInputs.rotation_y) {
            this.controlInputs.rotation_y.value = (this.rotation.y * 180 / Math.PI).toFixed (2);
        }
        if (this.controlInputs.rotation_z) {
            this.controlInputs.rotation_z.value = (this.rotation.z * 180 / Math.PI).toFixed (2);
        }
    }

    ShowPanel (show)
    {
        if (this.panelDiv) {
            this.panelDiv.style.display = show ? 'block' : 'none';
        }
    }

    Resize ()
    {
        // Nothing to resize currently
    }

    Clear ()
    {
        this.Deactivate ();
        if (this.panelDiv) {
            ClearDomElement (this.panelDiv);
        }
    }
}
