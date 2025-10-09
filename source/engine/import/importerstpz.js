import { ImporterOcct } from './importerocct.js';
import * as fflate from 'fflate';

export class ImporterStpz extends ImporterOcct
{
    constructor ()
    {
        super ();
    }

    CanImportExtension (extension)
    {
        return extension === 'stpz';
    }

    ImportContent (fileContent, onFinish)
    {
        try {
            // Decompress STPZ (which is a compressed STEP file)
            const compressedBuffer = new Uint8Array (fileContent);
            const decompressed = fflate.gunzipSync (compressedBuffer);

            // Now process as regular STEP file
            super.ImportContent (decompressed.buffer, onFinish);
        } catch (error) {
            this.SetError ('Failed to decompress STPZ file: ' + error.message);
            onFinish ();
        }
    }
}
