import type { LibDef } from "./load_lib.ts";

export interface AudioResult {
    pcm: Float32Array;
    sampleRate: number;
}

export function saveAudio(
  lib: Deno.StaticForeignLibraryInterface<LibDef>,
  audio: AudioResult,
  savePath: string,
) {
  const lenBuf = new BigUint64Array(1);
  const wavPtr = lib.crispasr_pcm_to_wav(
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
