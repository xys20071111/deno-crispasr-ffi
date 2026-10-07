import { loadAudio, strToPtr } from "../utils/create_c_object.ts";
import { LibDef, loadLib } from "../utils/load_lib.ts";

export interface AudioResult {
    pcm: Float32Array;
    sampleRate: number;
}

export abstract class BaseSession {
    protected lib: Deno.StaticForeignLibraryInterface<LibDef>;
    protected session: Deno.PointerObject;
    protected codecPath: string | undefined;
    constructor(libPath: string, modelPath: string, codecPath?: string) {
        this.lib = loadLib(libPath);
        const session = this.lib.crispasr_session_open(
            strToPtr(modelPath),
            4,
        );
        if (!session) {
            throw new Error("Cannot create session!");
        }
        this.session = session;
        if (codecPath) {
            this.codecPath = codecPath;
        }
    }

    public loadAudio(audioPath: string) {
        return loadAudio(this.lib, audioPath);
    }

    public saveAudio(audio: AudioResult, savePath: string) {
        const lenBuf = new BigUint64Array(1);
        const wavPtr = this.lib.crispasr_pcm_to_wav(
            Deno.UnsafePointer.of(audio.pcm),
            audio.pcm.length,
            audio.sampleRate,
            Deno.UnsafePointer.of(lenBuf),
        );
        if (wavPtr) {
            const len = Number(lenBuf[0]);
            const wav = Deno.UnsafePointerView.getArrayBuffer(wavPtr, len);
            Deno.writeFileSync(savePath, new Uint8Array(wav));
        }
    }

    public closeSession() {
        this.lib.crispasr_session_close(this.session)
    }
    public abstract run(...args: unknown[]): unknown;
}
