/**
 * Platform-independent AI Inference Abstraction Layer
 * Architecture:
 *   Game System -> UniversalAiEngine -> LocalInferenceProvider -> Native llama.cpp Runtime -> LFM2.5-2.6B-Q4_K_M.gguf
 */

export type ProviderId = 'embedded_native' | 'local_http_bridge';

export type ProviderPlatform = 'web' | 'windows_native' | 'android_native';

export type RuntimeArchitecture = 
  | 'embedded_in_process_llama_cpp' 
  | 'development_http_bridge'
  | 'unsupported_web_sandbox';

export interface InferenceMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface InferenceRequest {
  systemInstruction: string;
  prompt: string;
  messages?: InferenceMessage[];
  temperature?: number;
  max_tokens?: number;
  chat_template_kwargs?: {
    enable_thinking?: boolean;
  };
  model?: string;
}

export interface InferenceResponse {
  content: string;
  model: string;
  providerId: ProviderId;
  latencyMs: number;
  tokensUsed?: number;
  rawOutput?: any;
}

export interface NativePackagingRequirements {
  windows: {
    framework: string;
    runtime: string;
    modelPath: string;
    ipcBridge: string;
    buildTarget: string;
  };
  android: {
    framework: string;
    runtime: string;
    modelPath: string;
    jniBridge: string;
    buildTarget: string;
  };
}

export interface InferenceProviderStatus {
  id: ProviderId;
  name: string;
  isAvailable: boolean;
  isReady: boolean;
  modelName: string;
  modelPath: string;
  platform: ProviderPlatform;
  runtimeArchitecture: RuntimeArchitecture;
  statusDescription: string;
  lastLatencyMs: number;
  lastError?: string;
  capabilities: {
    multiTurn: boolean;
    characterMemory: boolean;
    nativeGguf: boolean;
    zeroNetworkRequired: boolean;
    inProcessExecution: boolean;
  };
  nativePackaging?: NativePackagingRequirements;
}

export interface LocalInferenceProvider {
  readonly id: ProviderId;
  readonly name: string;
  init(): Promise<boolean>;
  checkStatus(): Promise<InferenceProviderStatus>;
  getStatus(): InferenceProviderStatus;
  generateReply(request: InferenceRequest): Promise<InferenceResponse>;
}
