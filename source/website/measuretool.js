import { BigEps, IsEqualEps, RadDeg } from '../engine/geometry/geometry.js';
import { AddDiv, ClearDomElement } from '../engine/viewer/domutils.js';
import { AddSvgIconElement, IsDarkTextNeededForColor } from './utils.js';
import { Loc } from '../engine/core/localization.js';

// import * as THREE from 'three'; // Removed THREE.js dependency
import { ColorComponentToFloat, RGBColor } from '../engine/model/color.js';
import { IntersectionMode } from '../engine/viewer/viewermodel.js';

function GetFaceWorldNormal (intersection)
{
    // Simplified: return a default normal since THREE.js is not available
    console.log('GetFaceWorldNormal called - THREE.js functionality removed');
    return { x: 0, y: 0, z: 1 }; // Default normal
}

function CreateMaterial ()
{
    // Simplified: return a placeholder since THREE.js is not available
    console.log('CreateMaterial called - THREE.js functionality removed');
    return {}; // Placeholder
}

function CreateLineFromPoints (points, material)
{
    // Simplified: return a placeholder since THREE.js is not available
    console.log('CreateLineFromPoints called - THREE.js functionality removed');
    return {}; // Placeholder
}

class Marker
{
    constructor (intersection, radius)
    {
        this.intersection = null;
        this.markerObject = {}; // Placeholder object

        // Removed THREE.js marker creation
        console.log('Marker created - THREE.js functionality removed');

        this.UpdatePosition (intersection);
    }

    UpdatePosition (intersection)
    {
        this.intersection = intersection;
        // Removed THREE.js position updates
        console.log('Marker position updated - THREE.js functionality removed');
    }

    Show (show)
    {
        // Removed THREE.js visibility
        console.log('Marker visibility set to', show, '- THREE.js functionality removed');
    }

    GetIntersection ()
    {
        return this.intersection;
    }

    GetObject ()
    {
        return this.markerObject;
    }
}

function CalculateMarkerValues (aMarker, bMarker)
{
    const aIntersection = aMarker.GetIntersection ();
    const bIntersection = bMarker.GetIntersection ();
    let result = {
        pointsDistance : null,
        parallelFacesDistance : null,
        facesAngle : null
    };

    // Simplified calculations without THREE.js
    console.log('CalculateMarkerValues called - THREE.js functionality removed');
    // Basic distance calculation if points have distanceTo method
    if (aIntersection.point && bIntersection.point && aIntersection.point.distanceTo) {
        result.pointsDistance = aIntersection.point.distanceTo (bIntersection.point);
    }
    // Angle calculation simplified
    result.facesAngle = 0; // Default angle
    result.parallelFacesDistance = null; // Not calculated without THREE.js

    return result;
}

export class MeasureTool
{
    constructor (viewer, settings)
    {
        this.viewer = viewer;
        this.settings = settings;
        this.isActive = false;
        this.markers = [];
        this.tempMarker = null;

        this.panel = null;
        this.button = null;
    }

    SetButton (button)
    {
        this.button = button;
    }

    IsActive ()
    {
        return this.isActive;
    }

    SetActive (isActive)
    {
        if (this.isActive === isActive) {
            return;
        }
        this.isActive = isActive;
        this.button.SetSelected (isActive);
        if (this.isActive) {
            this.panel = AddDiv (document.body, 'ov_measure_panel');
            this.UpdatePanel ();
            this.Resize ();
        } else {
            this.ClearMarkers ();
            this.panel.remove ();
        }
    }

    Click (mouseCoordinates)
    {
        let intersection = this.viewer.GetMeshIntersectionUnderMouse (IntersectionMode.MeshOnly, mouseCoordinates);
        if (intersection === null) {
            this.ClearMarkers ();
            this.UpdatePanel ();
            return;
        }

        if (this.markers.length === 2) {
            this.ClearMarkers ();
        }

        this.AddMarker (intersection);
        this.UpdatePanel ();
    }

    MouseMove (mouseCoordinates)
    {
        let intersection = this.viewer.GetMeshIntersectionUnderMouse (IntersectionMode.MeshOnly, mouseCoordinates);
        if (intersection === null) {
            if (this.tempMarker !== null) {
                this.tempMarker.Show (false);
                this.viewer.Render ();
            }
            return;
        }
        if (this.tempMarker === null) {
            this.tempMarker = this.GenerateMarker (intersection);
        }
        this.tempMarker.UpdatePosition (intersection);
        this.tempMarker.Show (true);
        this.viewer.Render ();
    }

    AddMarker (intersection)
    {
        let marker = this.GenerateMarker (intersection);
        this.markers.push (marker);
        if (this.markers.length === 2) {
            let material = CreateMaterial ();
            let aPoint = this.markers[0].GetIntersection ().point;
            let bPoint = this.markers[1].GetIntersection ().point;
            this.viewer.AddExtraObject (CreateLineFromPoints ([aPoint, bPoint], material));
        }
    }

    GenerateMarker (intersection)
    {
        let boundingSphere = this.viewer.GetBoundingSphere ((meshUserData) => {
            return true;
        });

        let radius = boundingSphere.radius / 20.0;
        let marker = new Marker (intersection, radius);
        this.viewer.AddExtraObject (marker.GetObject ());
        return marker;
    }

    UpdatePanel ()
    {
        function BlendBackgroundWithPageBackground (backgroundColor)
        {
            let bodyStyle = window.getComputedStyle (document.body, null);
            let bgColors = bodyStyle.backgroundColor.match (/\d+/g);
            if (bgColors.length < 3) {
                return new RGBColor (backgroundColor.r, backgroundColor.g, backgroundColor.b);
            }
            let alpha = ColorComponentToFloat (backgroundColor.a);
            return new RGBColor (
                parseInt (bgColors[0], 10) * (1.0 - alpha) + backgroundColor.r * alpha,
                parseInt (bgColors[1], 10) * (1.0 - alpha) + backgroundColor.g * alpha,
                parseInt (bgColors[2], 10) * (1.0 - alpha) + backgroundColor.b * alpha
            );
        }

        function AddValue (panel, icon, title, value)
        {
            let svgIcon = AddSvgIconElement (panel, icon, 'left_inline');
            svgIcon.title = title;
            AddDiv (panel, 'ov_measure_value', value);
        }

        ClearDomElement (this.panel);
        if (this.settings.backgroundIsEnvMap) {
            this.panel.style.color = '#ffffff';
            this.panel.style.backgroundColor = 'rgba(0,0,0,0.5)';
        } else {
            let blendedColor = BlendBackgroundWithPageBackground (this.settings.backgroundColor);
            if (IsDarkTextNeededForColor (blendedColor)) {
                this.panel.style.color = '#000000';
            } else {
                this.panel.style.color = '#ffffff';
            }
            this.panel.style.backgroundColor = 'transparent';
        }
        if (this.markers.length === 0) {
            this.panel.innerHTML = Loc ('Select a point.');
        } else if (this.markers.length === 1) {
            this.panel.innerHTML = Loc ('Select another point.');
        } else {
            let calcResult = CalculateMarkerValues (this.markers[0], this.markers[1]);

            if (calcResult.pointsDistance !== null) {
                AddValue (this.panel, 'measure_distance', 'Distance of points', calcResult.pointsDistance.toFixed (3));
            }
            if (calcResult.parallelFacesDistance !== null) {
                AddValue (this.panel, 'measure_distance_parallel', 'Distance of parallel faces', calcResult.parallelFacesDistance.toFixed (3));
            }
            if (calcResult.facesAngle !== null) {
                let degreeValue = calcResult.facesAngle * RadDeg;
                AddValue (this.panel, 'measure_angle', 'Angle of faces', degreeValue.toFixed (1) + '\xB0');
            }
        }
        this.Resize ();
    }

    Resize ()
    {
        if (!this.isActive) {
            return;
        }
        let canvas = this.viewer.GetCanvas ();
        let canvasRect = canvas.getBoundingClientRect ();
        let panelRect = this.panel.getBoundingClientRect ();
        let canvasWidth = canvasRect.right - canvasRect.left;
        let panelWidth = panelRect.right - panelRect.left;
        this.panel.style.left = (canvasRect.left + (canvasWidth - panelWidth) / 2) + 'px';
        this.panel.style.top = (canvasRect.top + 10) + 'px';
    }

    ClearMarkers ()
    {
        this.viewer.ClearExtra ();
        this.markers = [];
        this.tempMarker = null;
    }
}
