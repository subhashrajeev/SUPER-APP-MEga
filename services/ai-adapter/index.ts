/**
 * AI Adapter Service
 * Pluggable adapters for various AI providers
 * Supports: OpenAI, Anthropic Claude, Stable Diffusion, Image Enhancement
 */

import OpenAI from 'openai';

// ============================================================================
// Types
// ============================================================================

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'replicate';
  apiKey: string;
  model?: string;
}

export interface TextGenerationOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface ImageGenerationOptions {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

export interface ImageEnhancementOptions {
  imageUrl: string;
  operation: 'remove_background' | 'upscale' | 'enhance';
}

// ============================================================================
// OpenAI Adapter
// ============================================================================

class OpenAIAdapter {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateText(options: TextGenerationOptions): Promise<string> {
    const { prompt, maxTokens = 500, temperature = 0.7, systemPrompt } = options;

    const messages: OpenAI.ChatCompletionMessageParam[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      max_tokens: maxTokens,
      temperature,
    });

    return completion.choices[0]?.message?.content || '';
  }

  async generateImage(options: ImageGenerationOptions): Promise<string> {
    const { prompt, size = '1024x1024', quality = 'standard' } = options;

    const response = await this.client.images.generate({
      model: 'dall-e-3',
      prompt,
      size,
      quality,
      n: 1,
    });

    return response.data[0]?.url || '';
  }
}

// ============================================================================
// Anthropic Claude Adapter
// ============================================================================

class AnthropicAdapter {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateText(options: TextGenerationOptions): Promise<string> {
    const { prompt, maxTokens = 1000, temperature = 0.7, systemPrompt } = options;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    return data.content[0]?.text || '';
  }
}

// ============================================================================
// Image Enhancement Adapter
// ============================================================================

class ImageEnhancementAdapter {
  private removeBgApiKey: string;

  constructor(removeBgApiKey: string) {
    this.removeBgApiKey = removeBgApiKey;
  }

  async removeBackground(imageUrl: string): Promise<string> {
    if (!this.removeBgApiKey) {
      throw new Error('Remove.bg API key not configured');
    }

    const formData = new FormData();
    formData.append('image_url', imageUrl);
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': this.removeBgApiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Background removal failed');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  async upscaleImage(imageUrl: string): Promise<string> {
    // Placeholder for image upscaling
    // Can integrate with services like DeepAI, Let's Enhance, or Replicate
    console.log('Image upscaling requested for:', imageUrl);
    return imageUrl; // Return original for now
  }
}

// ============================================================================
// Main AI Service
// ============================================================================

export class AIService {
  private openai?: OpenAIAdapter;
  private anthropic?: AnthropicAdapter;
  private imageEnhancement?: ImageEnhancementAdapter;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAIAdapter(process.env.OPENAI_API_KEY);
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new AnthropicAdapter(process.env.ANTHROPIC_API_KEY);
    }

    if (process.env.REMOVE_BG_API_KEY) {
      this.imageEnhancement = new ImageEnhancementAdapter(
        process.env.REMOVE_BG_API_KEY
      );
    }
  }

  async generateText(
    options: TextGenerationOptions,
    provider: 'openai' | 'anthropic' = 'openai'
  ): Promise<string> {
    if (provider === 'openai' && this.openai) {
      return this.openai.generateText(options);
    }

    if (provider === 'anthropic' && this.anthropic) {
      return this.anthropic.generateText(options);
    }

    throw new Error(`AI provider ${provider} not configured`);
  }

  async generateImage(options: ImageGenerationOptions): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI not configured for image generation');
    }

    return this.openai.generateImage(options);
  }

  async enhanceImage(options: ImageEnhancementOptions): Promise<string> {
    if (!this.imageEnhancement) {
      throw new Error('Image enhancement service not configured');
    }

    switch (options.operation) {
      case 'remove_background':
        return this.imageEnhancement.removeBackground(options.imageUrl);
      case 'upscale':
        return this.imageEnhancement.upscaleImage(options.imageUrl);
      default:
        throw new Error(`Unsupported operation: ${options.operation}`);
    }
  }
}

// Singleton instance
export const aiService = new AIService();
