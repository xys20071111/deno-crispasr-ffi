import { strToPtr } from "../utils/create_c_object.ts";
import { BaseSession } from "./base_session.ts";

interface Word {
    text: string;
    start: number;
    end: number;
    confidence: number;
}
interface Segment {
    text: string;
    start: number;
    end: number;
    words: Word[];
}

export class ASRSession extends BaseSession {
    public override run(audioPath: string, lang = 'zh'): Segment[] {
        const audio = this.loadAudio(audioPath);
        const result = this.lib.crispasr_session_transcribe_lang(
            this.session,
            Deno.UnsafePointer.of(audio.pcm),
            audio.pcm.length,
            strToPtr(lang)
        );
        if (!result) {
            throw new Error("transcribe failed");
        }
        const sgementCount = this.lib.crispasr_session_result_n_segments(
            result,
        );
        const segments: Segment[] = [];
        for (let i = 0; i < sgementCount; i++) {
            const textPtr = this.lib.crispasr_session_result_segment_text(
                result,
                i,
            );
            const text = textPtr
                ? Deno.UnsafePointerView.getCString(textPtr)
                : "";
            const t0 =
                Number(this.lib.crispasr_session_result_segment_t0(result, i)) /
                100;
            const t1 =
                Number(this.lib.crispasr_session_result_segment_t1(result, i)) /
                100;
            const nWords = this.lib.crispasr_session_result_n_words(result, i);
            const words: Word[] = [];
            for (let j = 0; j < nWords; j++) {
                const wPtr = this.lib.crispasr_session_result_word_text(
                    result,
                    i,
                    j,
                );
                words.push({
                    text: wPtr ? Deno.UnsafePointerView.getCString(wPtr) : "",
                    start: Number(
                        this.lib.crispasr_session_result_word_t0(
                            result,
                            i,
                            j,
                        ),
                    ) / 100,
                    end: Number(
                        this.lib.crispasr_session_result_word_t1(result, i, j),
                    ) / 100,
                    confidence: this.lib.crispasr_session_result_word_p(
                        result,
                        i,
                        j,
                    ),
                });
            }
            segments.push({ text, start: t0, end: t1, words });
        }
        this.lib.crispasr_session_result_free(result);
        return segments;
    }
}
