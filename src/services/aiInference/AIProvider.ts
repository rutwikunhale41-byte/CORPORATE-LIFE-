/**
 * Clean AI Provider Abstraction
 * Architecture:
 *   Game -> UniversalAiEngine -> AIProvider -> Embedded Local AI Runtime -> LFM2.5
 */

export interface AIProviderContext {
  characterId?: string;
  characterName?: string;
  role?: string;
  department?: string;
  mood?: string;
  app?: string;
  timeContext?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIProviderMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIProviderResponse {
  content: string;
  model: string;
  tokensUsed?: number;
  latencyMs?: number;
  rawOutput?: any;
}

export interface AIProviderStatus {
  isReady: boolean;
  model: string;
  runtime: string;
  platform: 'web_sandbox' | 'windows_native' | 'android_native';
  description: string;
  nativePackaging: {
    windows: {
      target: string;
      framework: string;
      modelFile: string;
      bridgeInterface: string;
    };
    android: {
      target: string;
      framework: string;
      modelFile: string;
      bridgeInterface: string;
    };
  };
}

export interface AIProvider {
  id: string;
  name: string;
  isReady: boolean;
  generateResponse(messages: AIProviderMessage[], context?: AIProviderContext): Promise<AIProviderResponse>;
  getStatus(): AIProviderStatus;
}
