import type { LibDef } from "./load_lib.ts";

export interface Audio {
   sr: number
   sampleCount: number
   pcm: Float32Array
}

const encoder = new TextEncoder();

export function strToPtr(str: string): Deno.PointerValue {
   return Deno.UnsafePointer.of(encoder.encode(str + "\0"));
}

export function loadAudio(
   lib: Deno.StaticForeignLibraryInterface<LibDef>,
   audioPath: string,
): Audio {
   const sampleCountPtr = new Uint8Array(4);
   const sampleRatePtr = new Uint8Array(4);
   const pcmArrayPtr = new BigUint64Array(1); // *float[]
   const rc = lib.crispasr_audio_load(
      strToPtr(audioPath),
      Deno.UnsafePointer.of(pcmArrayPtr),
      Deno.UnsafePointer.of(sampleCountPtr),
      Deno.UnsafePointer.of(sampleRatePtr),
   );
   if (rc !== 0) {
      throw new Error(`crispasr_audio_load failed: ${rc}`);
   }
   const pcmPtr = Deno.UnsafePointer.create(pcmArrayPtr[0]);
   if (!pcmPtr) {
      throw new Error("no PCM returned");
   }
   // 千万别忘了这个littleEndian，不然直接给你 SIGSEGV 掉
   const sampleCount = new DataView(sampleCountPtr.buffer).getInt32(0, true);
   const pcm = new Float32Array(sampleCount);
   Deno.UnsafePointerView.copyInto(pcmPtr, pcm, 0);
   lib.crispasr_audio_free(pcmPtr);
   return {
      sr: new DataView(sampleRatePtr.buffer).getInt32(0, true),
      sampleCount,
      pcm,
   };
}
