import { strToPtr } from "../utils/str_to_prt.ts";
import { type LibDef, loadLib } from "../utils/load_lib.ts";
import { type Audio, loadAudio } from "../utils/load_audio.ts";
import { type AudioResult, saveAudio } from "../utils/save_audio.ts";

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

    public loadAudio(audioPath: string): Audio {
        return loadAudio(this.lib, audioPath);
    }

    public saveAudio(audio: AudioResult, savePath: string) {
        saveAudio(this.lib, audio, savePath)
    }

    public closeSession() {
        this.lib.crispasr_session_close(this.session)
    }
    public abstract run(...args: unknown[]): unknown;
}
