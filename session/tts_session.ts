import { strToPtr } from "../utils/create_c_object.ts";
import { AudioResult, BaseSession } from "./base_session.ts";

export class TTSSession extends BaseSession {
    constructor(libPath: string, modelPath: string, codecPath?: string) {
        super(libPath, modelPath, codecPath);
        this.lib.crispasr_session_accept_marking_responsibility(
            this.session,
            strToPtr(""),
        );
    }
    public resetSession(modelPath: string) {
        const session = this.lib.crispasr_session_open(
            strToPtr(modelPath),
            4,
        );
        if (!session) {
            throw new Error("Cannot create session!");
        }
        this.session = session;
    }
    private generate(text: string) {
        const sampleRate = this.lib.crispasr_session_output_sample_rate(
            this.session,
        );
        const sampleCountBuf = new Uint8Array(4);
        if (this.codecPath) {
            const rc = this.lib.crispasr_session_set_codec_path(
                this.session,
                strToPtr(this.codecPath),
            );
            if (rc !== 0) {
                throw new Error(`set_codec_path failed: ${rc}`);
            }
        }
        const pcmPtr = this.lib.crispasr_session_synthesize(
            this.session,
            strToPtr(text),
            Deno.UnsafePointer.of(sampleCountBuf),
        );
        if (!pcmPtr) {
            throw new Error("synthesize failed");
        }

        const nSamples = new DataView(sampleCountBuf.buffer).getInt32(0, true);

        // 在释放前复制 PCM 到 JS 拥有的内存
        const pcm = new Float32Array(nSamples);
        Deno.UnsafePointerView.copyInto(pcmPtr, pcm, 0);

        this.lib.crispasr_pcm_free(pcmPtr);

        return { pcm, sampleRate };
    }

    public override run(
        text: string,
        referenceVoicePath: string,
        referenceText?: string,
    ): AudioResult {
        if (this.codecPath) {
            this.lib.crispasr_session_set_codec_path(
                this.session,
                strToPtr(this.codecPath),
            );
        }
        const rc = this.lib.crispasr_session_set_voice(
            this.session,
            strToPtr(referenceVoicePath),
            referenceText ? strToPtr(referenceText) : null,
        );
        if (rc !== 0) {
            throw new Error(`set_voice failed: ${rc}`);
        }

        return this.generate(text);
    }

    public runVoiceDesign(text: string, design: string) {
        if (this.lib.crispasr_session_is_voice_design(this.session) !== 1) {
            console.warn("当前模型不是 VoiceDesign 变体");
        }
        const rc = this.lib.crispasr_session_set_instruct(
            this.session,
            strToPtr(design),
        );
        if (rc !== 0) {
            throw new Error(`set_instruct failed: ${rc}`);
        }

        return this.generate(text);
    }
}
