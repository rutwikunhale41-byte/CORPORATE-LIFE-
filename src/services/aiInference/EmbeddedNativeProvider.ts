import {
  AIProvider,
  AIProviderMessage,
  AIProviderContext,
  AIProviderResponse,
  AIProviderStatus,
} from './AIProvider';

/**
 * EmbeddedLocalAIProvider
 * 
 * Standalone in-process local AI runtime powered by llama.cpp and LFM2.5 GGUF.
 * 
 * Target Architecture:
 *   Windows PC: In-process IPC (window.__NATIVE_LLAMA_RUNTIME__) -> llama.dll -> LFM2.5-2.6B-Q4_K_M.gguf
 *   Android APK: In-process JNI (window.AndroidLlamaBridge) -> libllama.so -> LFM2.5-2.6B-Q4_K_M.gguf
 * 
 * Zero external servers, zero bridge.js, zero BAT launcher, zero localhost ports, zero CORS/PNA.
 */
export class EmbeddedLocalAIProvider implements AIProvider {
  public readonly id = 'embedded_local_ai';
  public readonly name = 'Embedded Local AI Runtime (llama.cpp)';

  public isReady: boolean = false;
  private platform: 'web_sandbox' | 'windows_native' | 'android_native' = 'web_sandbox';
  private readonly modelName = 'LiquidAI/LFM2.5-2.6B-GGUF:Q4_K_M';
  private readonly modelFile = 'LFM2.5-2.6B-Q4_K_M.gguf';

  constructor() {
    this.detectEnvironment();
  }

  private detectEnvironment() {
    if (typeof window === 'undefined') {
      this.platform = 'web_sandbox';
      this.isReady = false;
      return;
    }

    const win = window as any;

    // 1. Android Native JNI Bridge (Capacitor / Android NDK)
    if (win.AndroidLlamaBridge && typeof win.AndroidLlamaBridge.generateReply === 'function') {
      this.platform = 'android_native';
      this.isReady = true;
      return;
    }

    // 2. Windows PC Native IPC Bridge (Tauri / Electron / C++ Addon)
    if (win.__NATIVE_LLAMA_RUNTIME__ && typeof win.__NATIVE_LLAMA_RUNTIME__.generateReply === 'function') {
      this.platform = 'windows_native';
      this.isReady = true;
      return;
    }

    if (win.__TAURI__ && typeof win.__TAURI__.invoke === 'function') {
      this.platform = 'windows_native';
      this.isReady = true;
      return;
    }

    if (win.electronAPI?.llama && typeof win.electronAPI.llama.generate === 'function') {
      this.platform = 'windows_native';
      this.isReady = true;
      return;
    }

    // 3. Web sandbox: Native llama.cpp is not compiled into the web sandbox.
    this.platform = 'web_sandbox';
    this.isReady = false;
  }

  public getStatus(): AIProviderStatus {
    this.detectEnvironment();

    let description = '';
    if (this.isReady) {
      description = `Embedded native llama.cpp runtime active (${this.platform}). In-process execution with ${this.modelFile}.`;
    } else {
      description = `Embedded Local AI is awaiting native packaging. Run the standalone Windows (.exe) or Android (.apk) build containing bundled ${this.modelFile}.`;
    }

    return {
      isReady: this.isReady,
      model: this.modelName,
      runtime: this.isReady ? 'In-Process Native llama.cpp' : 'Awaiting Standalone Native Build',
      platform: this.platform,
      description,
      nativePackaging: {
        windows: {
          target: 'Windows 64-bit Standalone Executable (.exe / .msi)',
          framework: 'Tauri v2 / Electron with embedded llama.dll',
          modelFile: `resources\\models\\${this.modelFile}`,
          bridgeInterface: 'window.__NATIVE_LLAMA_RUNTIME__.generateReply() (in-process IPC)',
        },
        android: {
          target: 'Android Standalone APK / AAB (arm64-v8a)',
          framework: 'Capacitor 6 / Android NDK with libllama.so',
          modelFile: `assets/models/${this.modelFile}`,
          bridgeInterface: 'window.AndroidLlamaBridge.generateReply() (in-process JNI)',
        },
      },
    };
  }

  /**
   * Generates response via native in-process llama.cpp runtime.
   * Throws cleanly if not yet running inside the native wrapper; NEVER generates fake responses.
   */
  public async generateResponse(
    messages: AIProviderMessage[],
    context?: AIProviderContext
  ): Promise<AIProviderResponse> {
    const start = Date.now();
    this.detectEnvironment();

    const win = window as any;

    // 1. Android Native Execution
    if (this.platform === 'android_native' && win.AndroidLlamaBridge) {
      try {
        const payloadJson = JSON.stringify({
          messages,
          context,
          maxTokens: context?.maxTokens || 350,
          temperature: context?.temperature || 0.7,
          model: this.modelFile,
        });

        const rawResult = await win.AndroidLlamaBridge.generateReply(payloadJson);
        const parsed = typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;

        return {
          content: parsed.content || parsed.text || '',
          model: this.modelName,
          latencyMs: Date.now() - start,
          rawOutput: parsed,
        };
      } catch (err: any) {
        throw new Error(`Android native llama.cpp error: ${err?.message || err}`);
      }
    }

    // 2. Windows PC Native Execution
    if (this.platform === 'windows_native') {
      try {
        let content = '';
        let rawOutput: any = null;

        if (win.__NATIVE_LLAMA_RUNTIME__?.generateReply) {
          rawOutput = await win.__NATIVE_LLAMA_RUNTIME__.generateReply({
            messages,
            context,
            maxTokens: context?.maxTokens || 350,
            temperature: context?.temperature || 0.7,
            modelFile: this.modelFile,
          });
          content = rawOutput.content || rawOutput.text || '';
        } else if (win.__TAURI__?.invoke) {
          rawOutput = await win.__TAURI__.invoke('plugin:llama|generate', {
            request: {
              messages,
              max_tokens: context?.maxTokens || 350,
              temperature: context?.temperature || 0.7,
            },
          });
          content = rawOutput.content || rawOutput.text || '';
        } else if (win.electronAPI?.llama?.generate) {
          rawOutput = await win.electronAPI.llama.generate({
            messages,
            max_tokens: context?.maxTokens || 350,
            temperature: context?.temperature || 0.7,
          });
          content = rawOutput.content || rawOutput.text || '';
        }

        return {
          content,
          model: this.modelName,
          latencyMs: Date.now() - start,
          rawOutput,
        };
      } catch (err: any) {
        throw new Error(`Windows native llama.cpp error: ${err?.message || err}`);
      }
    }

    // 3. Web sandbox: Refuse cleanly without fake AI
    throw new Error(
      `EMBEDDED_LOCAL_AI_NOT_INITIALIZED: Embedded native LFM2.5 runtime requires the compiled Windows PC (.exe) or Android (.apk) wrapper with bundled ${this.modelFile}. Zero external bridge or localhost server is supported in production.`
    );
  }
}

export const embeddedLocalAIProvider = new EmbeddedLocalAIProvider();
