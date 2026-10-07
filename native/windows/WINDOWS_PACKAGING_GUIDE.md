# Windows PC Standalone Build Guide — Embedded Local AI

This document details the exact architecture and build process to package **Corporate Life AI** as a fully standalone Windows desktop application (`.exe`) with the **embedded LFM2.5-2.6B model**.

---

## 1. Architectural Blueprint

```
CorporateLifeAI.exe
 ├── Frontend Webview (React 19 + Tailwind CSS)
 ├── In-Process IPC Bridge (Tauri v2 / Electron / C++ Addon)
 ├── Native llama.cpp Runtime (llama.dll with AVX2/Direct3D 12)
 └── Bundled Model: resources/models/LFM2.5-2.6B-Q4_K_M.gguf
```

### Key Standalone Principles
- **Zero Localhost Ports**: No port 8080, no port 8765, no loopback sockets.
- **Zero Browser CORS/PNA**: Requests travel through in-process IPC (`window.__NATIVE_LLAMA_RUNTIME__` or `window.__TAURI__.invoke`).
- **Zero External Prerequisites**: The player does **not** need Python, Node.js, Git, or `llama-server`. Everything is bundled inside the installer.
- **Instant Launch**: Model is memory-mapped (`mmap`) into system RAM/VRAM upon game startup.

---

## 2. Directory Layout in Windows Package

```
CorporateLifeAI-Win64/
 ├── CorporateLifeAI.exe            # Main executable
 ├── llama.dll                      # Compiled llama.cpp shared library (AVX2/D3D12)
 ├── ggml.dll                       # GGML tensor engine
 ├── resources/
 │    └── models/
 │         └── LFM2.5-2.6B-Q4_K_M.gguf   # 1.85 GB quantized GGUF model
 └── ui/                            # Precompiled React Vite bundle (from `npm run build`)
```

---

## 3. Native IPC Bridge Specification

In the frontend, `EmbeddedNativeProvider.ts` looks for:
```typescript
window.__NATIVE_LLAMA_RUNTIME__.generateReply({
  systemInstruction: string,
  prompt: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number,
  temperature: number,
  modelFile: "LFM2.5-2.6B-Q4_K_M.gguf"
}): Promise<{ content: string; text?: string; tokensUsed?: number }>
```

### Tauri v2 Rust Bridge Implementation (`src-tauri/src/main.rs`)

```rust
use tauri::Manager;
use llama_cpp_rs::{LlamaModel, LlamaParams};

struct AiState {
    model: std::sync::Mutex<LlamaModel>,
}

#[tauri::command]
async fn llama_generate(
    state: tauri::State<'_, AiState>,
    system: String,
    prompt: String,
    max_tokens: u32,
    temperature: f32,
) -> Result<serde_json::Value, String> {
    let model = state.model.lock().unwrap();
    
    let formatted_prompt = format!(
        "<|im_start|>system\n{}<|im_end|>\n<|im_start|>user\n{}<|im_end|>\n<|im_start|>assistant\n",
        system, prompt
    );
    
    let output = model.predict(&formatted_prompt, max_tokens, temperature)
        .map_err(|e| e.to_string())?;
        
    Ok(serde_json::json!({
        "content": output,
        "model": "LFM2.5-2.6B-GGUF:Q4_K_M"
    }))
}

fn main() {
    let model_path = "resources/models/LFM2.5-2.6B-Q4_K_M.gguf";
    let model = LlamaModel::load_from_file(model_path, LlamaParams::default())
        .expect("Failed to load embedded LFM2.5 GGUF model");

    tauri::Builder::default()
        .manage(AiState { model: std::sync::Mutex::new(model) })
        .invoke_handler(tauri::generate_handler![llama_generate])
        .run(tauri::generate_context!())
        .expect("error while running corporate life ai");
}
```

---

## 4. One-Click Packaging Command (Windows)

```bash
# 1. Build the Vite production web bundle
npm run build

# 2. Package as Windows Standalone Installer via Tauri
npm run tauri build -- --target x86_64-pc-windows-msvc
```

Output:
`target/release/bundle/msi/CorporateLifeAI_1.0.0_x64_en-US.msi`
