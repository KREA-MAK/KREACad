import { Direction } from '../geometry/geometry.js';
import { ImporterThreeBase } from './importerthree.js';

import { USDZLoader } from 'three/examples/jsm/loaders/USDZLoader.js';

export class ImporterThreeUsd extends ImporterThreeBase
{
    constructor ()
    {
        super ();
    }

    CanImportExtension (extension)
    {
        return extension === 'usdz';
    }

    GetUpDirection ()
    {
        return Direction.Y;
    }

    CreateLoader (manager)
    {
        return new USDZLoader (manager);
    }

    GetMainObject (loadedObject)
    {
        return loadedObject;
    }
}
