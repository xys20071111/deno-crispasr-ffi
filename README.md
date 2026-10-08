A third-party warpper for using crispasr with deno

Notice: you need to provide the share library file.

### ASR example

```typescript
import { ASRSession } from "../../session/asr_session.ts";

const session = new ASRSession(
  "lib/libcrispasr.so.0.8.41",
  "example/asr/qwen3-asr-1.7b-q8_0.gguf",
);
const result = session.run("example/1_3_slice_0002.wav");

console.log(result);
```

### TTS example

```typescript
import { TTSSession } from "../../session/tts_session.ts";

const session = new TTSSession(
  "lib/libcrispasr.so.0.8.41",
  "example/tts/qwen3-tts-12hz-1.7b-voicedesign-q8_0.gguf",
  "example/tts/qwen3-tts-tokenizer-12hz.gguf",
);
session.setDesign("年轻，富有活力的少女音");
const vd = session.runVoiceDesign("你好，很高兴认识你！");
session.saveAudio(vd, "test_2.wav");
session.closeSession();
```
