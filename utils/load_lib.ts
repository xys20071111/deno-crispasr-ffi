export type LibDef = {
  // ── 库生命周期 ──
  crispasr_c_api_version: { parameters: []; result: "pointer" };

  // ── 会话（ASR + TTS 统一） ──
  crispasr_session_open: {
    parameters: ["pointer", "i32"];
    result: "pointer";
  };
  crispasr_session_open_explicit: {
    parameters: ["pointer", "pointer", "i32"];
    result: "pointer";
  };
  crispasr_session_close: { parameters: ["pointer"]; result: "void" };
  crispasr_session_backend: { parameters: ["pointer"]; result: "pointer" };
  crispasr_session_input_sample_rate: {
    parameters: ["pointer"];
    result: "i32";
  };
  crispasr_session_output_sample_rate: {
    parameters: ["pointer"];
    result: "i32";
  };

  // ── ASR：转录 ──
  crispasr_session_transcribe: {
    parameters: ["pointer", "pointer", "i32"];
    result: "pointer";
  };
  crispasr_session_transcribe_lang: {
    parameters: ["pointer", "pointer", "i32", "pointer"];
    result: "pointer";
  };
  crispasr_session_transcribe_chunked_lang: {
    parameters: ["pointer", "pointer", "i32", "i32", "i32", "pointer"];
    result: "pointer";
  };
  crispasr_session_transcribe_vad: {
    parameters: ["pointer", "pointer", "i32", "i32", "pointer", "pointer"];
    result: "pointer";
  };

  // ── ASR：读取结果 ──
  crispasr_session_result_n_segments: {
    parameters: ["pointer"];
    result: "i32";
  };
  crispasr_session_result_segment_text: {
    parameters: ["pointer", "i32"];
    result: "pointer";
  };
  crispasr_session_result_segment_t0: {
    parameters: ["pointer", "i32"];
    result: "i64";
  };
  crispasr_session_result_segment_t1: {
    parameters: ["pointer", "i32"];
    result: "i64";
  };
  crispasr_session_result_n_words: {
    parameters: ["pointer", "i32"];
    result: "i32";
  };
  crispasr_session_result_word_text: {
    parameters: ["pointer", "i32", "i32"];
    result: "pointer";
  };
  crispasr_session_result_word_t0: {
    parameters: ["pointer", "i32", "i32"];
    result: "i64";
  };
  crispasr_session_result_word_t1: {
    parameters: ["pointer", "i32", "i32"];
    result: "i64";
  };
  crispasr_session_result_word_p: {
    parameters: ["pointer", "i32", "i32"];
    result: "f32";
  };
  // crispasr_session_result_speaker: {
  //   parameters: ["pointer", "i32"],
  //   result: "pointer",
  // },
  crispasr_session_result_free: { parameters: ["pointer"]; result: "void" };

  // ── TTS：合成 ──
  crispasr_session_synthesize: {
    parameters: ["pointer", "pointer", "pointer"];
    result: "pointer";
  };
  crispasr_session_synthesize_streaming: {
    parameters: ["pointer", "pointer", "function", "pointer"];
    result: "i32";
  };
  crispasr_pcm_free: { parameters: ["pointer"]; result: "void" };

  // ── 音频文件加载 ──
  crispasr_audio_load: {
    parameters: ["pointer", "pointer", "pointer", "pointer"];
    result: "i32";
  };
  crispasr_audio_load_at_rate: {
    parameters: ["pointer", "i32", "pointer", "pointer", "pointer"];
    result: "i32";
  };
  crispasr_audio_free: { parameters: ["pointer"]; result: "void" };

  // ── 后端检测 ──
  crispasr_detect_backend_from_gguf: {
    parameters: ["pointer", "pointer", "i32"];
    result: "i32";
  };
  crispasr_session_available_backends: {
    parameters: ["pointer", "i32"];
    result: "i32";
  };

  // ── TTS 控制设置 ──
  crispasr_session_set_voice: {
    parameters: ["pointer", "pointer", "pointer"];
    result: "i32";
  };
  crispasr_session_set_temperature: {
    parameters: ["pointer", "f32", "u64"];
    result: "i32";
  };
  crispasr_session_set_tts_seed: {
    parameters: ["pointer", "u64"];
    result: "i32";
  };
  crispasr_session_set_tts_steps: {
    parameters: ["pointer", "i32"];
    result: "i32";
  };
  crispasr_session_set_tts_cfg_scale: {
    parameters: ["pointer", "f32"];
    result: "i32";
  };
  crispasr_session_set_speaker_identity: {
    parameters: ["pointer", "pointer"];
    result: "i32";
  };
  crispasr_session_set_length_scale: {
    parameters: ["pointer", "f32"];
    result: "i32";
  };
  // ── Voice Clone / Voice Design / Custom Voice ──
  crispasr_session_set_voice_samples: {
    parameters: ["pointer", "pointer", "i32", "i32", "pointer"];
    result: "i32";
  };
  crispasr_session_set_speaker_name: {
    parameters: ["pointer", "pointer"];
    result: "i32";
  };
  crispasr_session_n_speakers: { parameters: ["pointer"]; result: "i32" };
  crispasr_session_get_speaker_name: {
    parameters: ["pointer", "i32"];
    result: "pointer";
  };
  crispasr_session_set_instruct: {
    parameters: ["pointer", "pointer"];
    result: "i32";
  };
  crispasr_session_is_custom_voice: { parameters: ["pointer"]; result: "i32" };
  crispasr_session_is_voice_design: { parameters: ["pointer"]; result: "i32" };
  crispasr_session_set_codec_path: {
    parameters: ["pointer", "pointer"];
    result: "i32";
  };
  crispasr_session_get_disclaimer_pcm: {
    parameters: ["pointer", "pointer"];
    result: "pointer";
  };
  crispasr_session_disclaimer_text: { parameters: []; result: "pointer" };

  // 生成WAV文件
  crispasr_pcm_to_wav: {
    parameters: ["pointer", "i32", "i32", "pointer"];
    result: "pointer";
  };
  crispasr_session_accept_marking_responsibility: {
    parameters: ["pointer", "pointer"];
    result: "i32";
  };
};

export function loadLib(libPath: string | URL) {
  const lib = Deno.dlopen(
    libPath,
    {
      // ── 库生命周期 ──
      crispasr_c_api_version: { parameters: [], result: "pointer" },

      // ── 会话（ASR + TTS 统一） ──
      crispasr_session_open: {
        parameters: ["pointer", "i32"],
        result: "pointer",
      },
      crispasr_session_open_explicit: {
        parameters: ["pointer", "pointer", "i32"],
        result: "pointer",
      },
      crispasr_session_close: { parameters: ["pointer"], result: "void" },
      crispasr_session_backend: { parameters: ["pointer"], result: "pointer" },
      crispasr_session_input_sample_rate: {
        parameters: ["pointer"],
        result: "i32",
      },
      crispasr_session_output_sample_rate: {
        parameters: ["pointer"],
        result: "i32",
      },

      // ── ASR：转录 ──
      crispasr_session_transcribe: {
        parameters: ["pointer", "pointer", "i32"],
        result: "pointer",
      },
      crispasr_session_transcribe_lang: {
        parameters: ["pointer", "pointer", "i32", "pointer"],
        result: "pointer",
      },
      crispasr_session_transcribe_chunked_lang: {
        parameters: ["pointer", "pointer", "i32", "i32", "i32", "pointer"],
        result: "pointer",
      },
      crispasr_session_transcribe_vad: {
        parameters: ["pointer", "pointer", "i32", "i32", "pointer", "pointer"],
        result: "pointer",
      },

      // ── ASR：读取结果 ──
      crispasr_session_result_n_segments: {
        parameters: ["pointer"],
        result: "i32",
      },
      crispasr_session_result_segment_text: {
        parameters: ["pointer", "i32"],
        result: "pointer",
      },
      crispasr_session_result_segment_t0: {
        parameters: ["pointer", "i32"],
        result: "i64",
      },
      crispasr_session_result_segment_t1: {
        parameters: ["pointer", "i32"],
        result: "i64",
      },
      crispasr_session_result_n_words: {
        parameters: ["pointer", "i32"],
        result: "i32",
      },
      crispasr_session_result_word_text: {
        parameters: ["pointer", "i32", "i32"],
        result: "pointer",
      },
      crispasr_session_result_word_t0: {
        parameters: ["pointer", "i32", "i32"],
        result: "i64",
      },
      crispasr_session_result_word_t1: {
        parameters: ["pointer", "i32", "i32"],
        result: "i64",
      },
      crispasr_session_result_word_p: {
        parameters: ["pointer", "i32", "i32"],
        result: "f32",
      },
      // crispasr_session_result_speaker: {
      //   parameters: ["pointer", "i32"],
      //   result: "pointer",
      // },
      crispasr_session_result_free: { parameters: ["pointer"], result: "void" },

      // ── TTS：合成 ──
      crispasr_session_synthesize: {
        parameters: ["pointer", "pointer", "pointer"],
        result: "pointer",
      },
      crispasr_session_synthesize_streaming: {
        parameters: ["pointer", "pointer", "function", "pointer"],
        result: "i32",
      },
      crispasr_pcm_free: { parameters: ["pointer"], result: "void" },

      // ── 音频文件加载 ──
      crispasr_audio_load: {
        parameters: ["pointer", "pointer", "pointer", "pointer"],
        result: "i32",
      },
      crispasr_audio_load_at_rate: {
        parameters: ["pointer", "i32", "pointer", "pointer", "pointer"],
        result: "i32",
      },
      crispasr_audio_free: { parameters: ["pointer"], result: "void" },

      // ── 后端检测 ──
      crispasr_detect_backend_from_gguf: {
        parameters: ["pointer", "pointer", "i32"],
        result: "i32",
      },
      crispasr_session_available_backends: {
        parameters: ["pointer", "i32"],
        result: "i32",
      },

      // ── TTS 控制设置 ──
      crispasr_session_set_voice: {
        parameters: ["pointer", "pointer", "pointer"],
        result: "i32",
      },
      crispasr_session_set_temperature: {
        parameters: ["pointer", "f32", "u64"],
        result: "i32",
      },
      crispasr_session_set_tts_seed: {
        parameters: ["pointer", "u64"],
        result: "i32",
      },
      crispasr_session_set_tts_steps: {
        parameters: ["pointer", "i32"],
        result: "i32",
      },
      crispasr_session_set_tts_cfg_scale: {
        parameters: ["pointer", "f32"],
        result: "i32",
      },
      crispasr_session_set_speaker_identity: {
        parameters: ["pointer", "pointer"],
        result: "i32",
      },
      crispasr_session_set_length_scale: {
        parameters: ["pointer", "f32"],
        result: "i32",
      },

      // ── Voice Clone / Voice Design / Custom Voice ──
      crispasr_session_set_voice_samples: {
        parameters: ["pointer", "pointer", "i32", "i32", "pointer"],
        result: "i32",
      },
      crispasr_session_set_speaker_name: {
        parameters: ["pointer", "pointer"],
        result: "i32",
      },
      crispasr_session_n_speakers: { parameters: ["pointer"], result: "i32" },
      crispasr_session_get_speaker_name: {
        parameters: ["pointer", "i32"],
        result: "pointer",
      },
      crispasr_session_set_instruct: {
        parameters: ["pointer", "pointer"],
        result: "i32",
      },
      crispasr_session_is_custom_voice: {
        parameters: ["pointer"],
        result: "i32",
      },
      crispasr_session_is_voice_design: {
        parameters: ["pointer"],
        result: "i32",
      },
      crispasr_session_set_codec_path: {
        parameters: ["pointer", "pointer"],
        result: "i32",
      },
      crispasr_session_get_disclaimer_pcm: {
        parameters: ["pointer", "pointer"],
        result: "pointer",
      },
      crispasr_session_disclaimer_text: { parameters: [], result: "pointer" },
      // 生成WAV文件
      crispasr_pcm_to_wav: {
        parameters: ["pointer", "i32", "i32", "pointer"],
        result: "pointer",
      },
      crispasr_session_accept_marking_responsibility: {
        parameters: ["pointer", "pointer"],
        result: "i32",
      },
    } as const,
  );
  return lib.symbols;
}

if (import.meta.main) {
  // deno-lint-ignore no-inner-declarations
  function main() {
    const libpath = "lib/libcrispasr.so.0.8.41";
    const symbols = loadLib(libpath);
    const version = symbols.crispasr_c_api_version();
    if (!version) {
      console.log("Cannot get api version!");
      return;
    }
    console.log(Deno.UnsafePointerView.getCString(version, 0));
  }
  main();
}
