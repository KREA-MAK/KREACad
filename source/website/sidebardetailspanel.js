import { RunTaskAsync } from '../engine/core/taskrunner.js';
import { SubCoord3D } from '../engine/geometry/coord3d.js';
import { GetBoundingBox, IsTwoManifold } from '../engine/model/modelutils.js';
import { CalculateVolume, CalculateSurfaceArea } from '../engine/model/quantities.js';
import { Property, PropertyToString, PropertyType } from '../engine/model/property.js';
import { AddDiv, AddDomElement, ClearDomElement } from '../engine/viewer/domutils.js';
import { SidebarPanel } from './sidebarpanel.js';
import { CreateInlineColorCircle } from './utils.js';
import { GetFileName, IsUrl } from '../engine/io/fileutils.js';
import { MaterialSource, MaterialType } from '../engine/model/material.js';
import { RGBColorToHexString } from '../engine/model/color.js';
import { Unit } from '../engine/model/unit.js';
import { Loc } from '../engine/core/localization.js';
import { Model } from '../engine/model/model.js';

function UnitToString (unit)
{
    switch (unit) {
        case Unit.Millimeter:
            return Loc ('Millimeter');
        case Unit.Centimeter:
            return Loc ('Centimeter');
        case Unit.Meter:
            return Loc ('Meter');
        case Unit.Inch:
            return Loc ('Inch');
        case Unit.Foot:
            return Loc ('Foot');
    }
    return Loc ('Unknown');
}

// KreaCAD Material Database
const MATERIALS_DATABASE = [
    { name: 'Steel', density: 7.85, unit: 'kg/dm³' },
    { name: 'Stainless Steel', density: 7.86, unit: 'kg/dm³' },
    { name: 'Aluminium', density: 2.7, unit: 'kg/dm³' }
];

export class SidebarDetailsPanel extends SidebarPanel
{
    constructor (parentDiv)
    {
        super (parentDiv);
        this.selectedMaterial = MATERIALS_DATABASE[0]; // Default to Steel
        this.currentObject3D = null;
        this.currentModel = null;
    }

    GetName ()
    {
        return Loc ('Details');
    }

    GetIcon ()
    {
        return 'details';
    }

    ConvertVolumeToDm3 (volume, unit)
    {
        // Convert volume from model units to dm³
        // 1 dm³ = 1000 cm³ = 1e6 mm³ = 0.001 m³
        let volumeInDm3;
        switch (unit) {
            case Unit.Millimeter: // mm³ -> dm³
                volumeInDm3 = volume / 1_000_000.0;
                break;
            case Unit.Centimeter: // cm³ -> dm³
                volumeInDm3 = volume / 1000.0;
                break;
            case Unit.Meter: // m³ -> dm³
                volumeInDm3 = volume * 1000.0;
                break;
            case Unit.Inch: {
                // 1 inch = 25.4 mm => 1 in³ = 25.4^3 mm³
                const mm3 = volume * Math.pow(25.4, 3);
                volumeInDm3 = mm3 / 1_000_000.0;
                break;
            }
            case Unit.Foot: {
                // 1 foot = 304.8 mm => 1 ft³ = 304.8^3 mm³
                const mm3 = volume * Math.pow(304.8, 3);
                volumeInDm3 = mm3 / 1_000_000.0;
                break;
            }
            default:
                volumeInDm3 = volume; // fallback (assume already dm³)
        }
        return volumeInDm3;
    }

    CalculateWeightFromVolume (volume, unit)
    {
        if (volume <= 0 || isNaN(volume)) {
            return null;
        }
        const volumeInDm3 = this.ConvertVolumeToDm3(volume, unit);
        if (!isFinite(volumeInDm3)) {
            return null;
        }
        const densityKgPerDm3 = this.selectedMaterial.density;
        return volumeInDm3 * densityKgPerDm3;
    }

    AddObject3DProperties (model, object3D)
    {
        this.Clear ();
        this.currentModel = model;
        this.currentObject3D = object3D;

        let table = AddDiv (this.contentDiv, 'ov_property_table');
        let boundingBox = GetBoundingBox (object3D);
        let size = SubCoord3D (boundingBox.max, boundingBox.min);
        let unit = model.GetUnit ();

        this.AddProperty (table, new Property (PropertyType.Integer, Loc ('Vertices'), object3D.VertexCount ()));
        let lineSegmentCount = object3D.LineSegmentCount ();
        if (lineSegmentCount > 0) {
            this.AddProperty (table, new Property (PropertyType.Integer, Loc ('Lines'), lineSegmentCount));
        }
        let triangleCount = object3D.TriangleCount ();
        if (triangleCount > 0) {
            this.AddProperty (table, new Property (PropertyType.Integer, Loc ('Triangles'), triangleCount));
        }
        if (unit !== Unit.Unknown) {
            this.AddProperty (table, new Property (PropertyType.Text, Loc ('Unit'), UnitToString (unit)));
        }
        this.AddProperty (table, new Property (PropertyType.Number, Loc ('Size X'), size.x));
        this.AddProperty (table, new Property (PropertyType.Number, Loc ('Size Y'), size.y));
        this.AddProperty (table, new Property (PropertyType.Number, Loc ('Size Z'), size.z));

        // KreaCAD Material Selection
        this.AddMaterialDropdown (table);

        // Density property
        this.AddProperty (table, new Property (PropertyType.Text, Loc ('Density'), this.selectedMaterial.density + ' ' + this.selectedMaterial.unit));
        this.AddCalculatedProperty (table, Loc ('Volume'), () => {
            if (!IsTwoManifold (object3D)) {
                return null;
            }
            const volume = CalculateVolume (object3D);
            return new Property (PropertyType.Number, null, volume);
        });
        this.AddCalculatedProperty (table, Loc ('Surface'), () => {
            const surfaceArea = CalculateSurfaceArea (object3D);
            return new Property (PropertyType.Number, null, surfaceArea);
        });
        // KreaCAD Weight Calculation
        this.AddCalculatedProperty (table, Loc ('Weight'), () => {
            // Check if this is a Model (assembly) or individual mesh
            if (object3D instanceof Model) {
                // Calculate total weight for assembly
                let totalWeight = 0;
                let validMeshCount = 0;
                
                model.EnumerateMeshInstances ((meshInstance) => {
                    if (IsTwoManifold (meshInstance)) {
                        const volume = CalculateVolume (meshInstance);
                        const weight = this.CalculateWeightFromVolume(volume, unit);
                        if (weight !== null) {
                            totalWeight += weight;
                            validMeshCount++;
                        }
                    }
                });
                
                if (validMeshCount === 0) {
                    return null;
                }
                return new Property (PropertyType.Text, null, totalWeight.toFixed(2) + ' kg (Total)');
            } else {
                // Individual mesh weight calculation
                if (!IsTwoManifold (object3D)) {
                    return null;
                }
                const volume = CalculateVolume (object3D);
                const weightKg = this.CalculateWeightFromVolume(volume, unit);
                if (weightKg === null) {
                    return null;
                }
                return new Property (PropertyType.Text, null, weightKg.toFixed(2) + ' kg');
            }
        });

        // Add CSV Export button for assembly
        if (object3D instanceof Model) {
            this.AddExportToCSVButton (table);
        }

        if (object3D.PropertyGroupCount () > 0) {
            let customTable = AddDiv (this.contentDiv, 'ov_property_table ov_property_table_custom');
            for (let i = 0; i < object3D.PropertyGroupCount (); i++) {
                const propertyGroup = object3D.GetPropertyGroup (i);
                this.AddPropertyGroup (customTable, propertyGroup);
                for (let j = 0; j < propertyGroup.PropertyCount (); j++) {
                    const property = propertyGroup.GetProperty (j);
                    this.AddPropertyInGroup (customTable, property);
                }
            }
        }
        this.Resize ();
    }

    AddMaterialProperties (material)
    {
        function AddTextureMap (obj, table, name, map)
        {
            if (map === null || map.name === null) {
                return;
            }
            let fileName = GetFileName (map.name);
            obj.AddProperty (table, new Property (PropertyType.Text, name, fileName));
        }

        this.Clear ();
        let table = AddDiv (this.contentDiv, 'ov_property_table');
        let typeString = null;
        if (material.type === MaterialType.Phong) {
            typeString = Loc ('Phong');
        } else if (material.type === MaterialType.Physical) {
            typeString = Loc ('Physical');
        }
        let materialSource = (material.source !== MaterialSource.Model) ? Loc ('Default') : Loc ('Model');
        this.AddProperty (table, new Property (PropertyType.Text, Loc ('Source'), materialSource));
        this.AddProperty (table, new Property (PropertyType.Text, Loc ('Type'), typeString));
        if (material.vertexColors) {
            this.AddProperty (table, new Property (PropertyType.Text, Loc ('Color'), Loc ('Vertex colors')));
        } else {
            this.AddProperty (table, new Property (PropertyType.Color, Loc ('Color'), material.color));
            if (material.type === MaterialType.Phong) {
                this.AddProperty (table, new Property (PropertyType.Color, Loc ('Ambient'), material.ambient));
                this.AddProperty (table, new Property (PropertyType.Color, Loc ('Specular'), material.specular));
            }
        }
        if (material.type === MaterialType.Physical) {
            this.AddProperty (table, new Property (PropertyType.Percent, Loc ('Metalness'), material.metalness));
            this.AddProperty (table, new Property (PropertyType.Percent, Loc ('Roughness'), material.roughness));
        }
        this.AddProperty (table, new Property (PropertyType.Percent, Loc ('Opacity'), material.opacity));
        AddTextureMap (this, table, Loc ('Diffuse Map'), material.diffuseMap);
        AddTextureMap (this, table, Loc ('Bump Map'), material.bumpMap);
        AddTextureMap (this, table, Loc ('Normal Map'), material.normalMap);
        AddTextureMap (this, table, Loc ('Emissive Map'), material.emissiveMap);
        if (material.type === MaterialType.Phong) {
            AddTextureMap (this, table, Loc ('Specular Map'), material.specularMap);
        } else if (material.type === MaterialType.Physical) {
            AddTextureMap (this, table, Loc ('Metallic Map'), material.metalnessMap);
        }
        this.Resize ();
    }

    AddPropertyGroup (table, propertyGroup)
    {
        let row = AddDiv (table, 'ov_property_table_row group', propertyGroup.name);
        row.setAttribute ('title', propertyGroup.name);
    }

    AddProperty (table, property)
    {
        let row = AddDiv (table, 'ov_property_table_row');
        let nameColumn = AddDiv (row, 'ov_property_table_cell ov_property_table_name', property.name + ':');
        let valueColumn = AddDiv (row, 'ov_property_table_cell ov_property_table_value');
        nameColumn.setAttribute ('title', property.name);
        this.DisplayPropertyValue (property, valueColumn);
        return row;
    }

    AddPropertyInGroup (table, property)
    {
        let row = this.AddProperty (table, property);
        row.classList.add ('ingroup');
    }

    AddCalculatedProperty (table, name, calculateValue)
    {
        let row = AddDiv (table, 'ov_property_table_row');
        let nameColumn = AddDiv (row, 'ov_property_table_cell ov_property_table_name', name + ':');
        let valueColumn = AddDiv (row, 'ov_property_table_cell ov_property_table_value');
        nameColumn.setAttribute ('title', name);

        let calculateButton = AddDiv (valueColumn, 'ov_property_table_button', Loc ('Calculate...'));
        calculateButton.addEventListener ('click', () => {
            ClearDomElement (valueColumn);
            valueColumn.innerHTML = Loc ('Please wait...');
            RunTaskAsync (() => {
                let propertyValue = calculateValue ();
                if (propertyValue === null) {
                    valueColumn.innerHTML = '-';
                } else {
                    this.DisplayPropertyValue (propertyValue, valueColumn);
                }
            });
        });
    }

    DisplayPropertyValue (property, targetDiv)
    {
        ClearDomElement (targetDiv);
        let valueHtml = null;
        let valueTitle = null;
        if (property.type === PropertyType.Text) {
            if (IsUrl (property.value)) {
                valueHtml = '<a target="_blank" href="' + property.value + '">' + property.value + '</a>';
                valueTitle = property.value;
            } else {
                valueHtml = PropertyToString (property);
            }
        } else if (property.type === PropertyType.Color) {
            let hexString = '#' + RGBColorToHexString (property.value);
            let colorCircle = CreateInlineColorCircle (property.value);
            targetDiv.appendChild (colorCircle);
            AddDomElement (targetDiv, 'span', null, hexString);
        } else {
            valueHtml = PropertyToString (property);
        }
        if (valueHtml !== null) {
            targetDiv.innerHTML = valueHtml;
            targetDiv.setAttribute ('title', valueTitle !== null ? valueTitle : valueHtml);
        }
    }

    AddMaterialDropdown (table)
    {
        console.log('AddMaterialDropdown called'); // Debug

        // Dropdown row
        let row = AddDiv (table, 'ov_property_table_row');
        let name = AddDiv (row, 'ov_property_table_name');
        let value = AddDiv (row, 'ov_property_table_value');

        name.innerHTML = 'Material Selection'; // Loc kullanmadan test
        console.log('Material label added'); // Debug

    let select = AddDomElement (value, 'select', 'ov_material_dropdown');
    // All visual styling now handled via the CSS class .ov_material_dropdown to support themes.
    console.log('Select element created'); // Debug

        // Add options to dropdown
        for (let i = 0; i < MATERIALS_DATABASE.length; i++) {
            let material = MATERIALS_DATABASE[i];
            let option = AddDomElement (select, 'option', null);
            option.value = i;
            option.innerHTML = material.name + ' (' + material.density + ' ' + material.unit + ')';
            if (material === this.selectedMaterial) {
                option.selected = true;
            }
            console.log('Added material option:', material.name); // Debug
        }

        // Handle material change
        select.addEventListener ('change', (event) => {
            let selectedIndex = parseInt(event.target.value);
            this.selectedMaterial = MATERIALS_DATABASE[selectedIndex];

            // Refresh the panel to update density and weight calculations
            if (this.currentModel && this.currentObject3D) {
                this.AddObject3DProperties(this.currentModel, this.currentObject3D);
            }
        });
    }

    AddExportToCSVButton (table)
    {
        let row = AddDiv (table, 'ov_property_table_row');
        let nameColumn = AddDiv (row, 'ov_property_table_cell ov_property_table_name', Loc ('Export Parts List') + ':');
        let valueColumn = AddDiv (row, 'ov_property_table_cell ov_property_table_value');
        nameColumn.setAttribute ('title', Loc ('Export Parts List'));

        let exportButton = AddDiv (valueColumn, 'ov_property_table_button', Loc ('Export to CSV'));
        exportButton.addEventListener ('click', () => {
            this.ExportPartsListToCSV ();
        });
    }

    ExportPartsListToCSV ()
    {
        if (!this.currentModel) {
            return;
        }

        const unit = this.currentModel.GetUnit ();
        let csvContent = 'Part Name,Volume (' + UnitToString(unit) + '³),Weight (kg),Material\n';
        
        let partIndex = 1;
        this.currentModel.EnumerateMeshInstances ((meshInstance) => {
            const meshName = meshInstance.GetName() || 'Part ' + partIndex;
            
            if (IsTwoManifold (meshInstance)) {
                const volume = CalculateVolume (meshInstance);
                const weight = this.CalculateWeightFromVolume(volume, unit);
                
                if (volume > 0 && weight !== null) {
                    // Escape commas in name
                    const escapedName = '"' + meshName.replace(/"/g, '""') + '"';
                    csvContent += escapedName + ',' + 
                                  volume.toFixed(4) + ',' + 
                                  weight.toFixed(2) + ',' + 
                                  this.selectedMaterial.name + '\n';
                }
            }
            partIndex++;
        });

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'parts_list.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
