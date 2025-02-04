import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

/**
 * Type definition for OpenAI API response
 */
type OpenAIResponse = {
  choices: {
    message?: { content: string };
    text?: string; // Older models return `text`, GPT-4 returns `message.content`
  }[];
};

/**
 * Service responsible for interacting with OpenAI's GPT API.
 */
@Injectable()
export class ChatbotService {
  constructor(private configService: ConfigService) {}

  /**
   * Sends a user message to OpenAI's API and retrieves a chatbot response.
   *
   * @param {string} userMessage - The input message from the user.
   * @returns {Promise<string>} - The AI-generated response.
   * @throws {InternalServerErrorException} - If the OpenAI API request fails.
   */
  async chatWithAI(userMessage: string): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      console.error('OPENAI_API_KEY is missing in environment variables.');
      throw new InternalServerErrorException(
        'AI service is not properly configured.',
      );
    }

    try {
      const response = await axios.post<OpenAIResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo', // Ensure the correct model is used
          messages: [{ role: 'user', content: userMessage }],
        },
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      );

      const reply =
        response.data.choices?.[0]?.message?.content ||
        response.data.choices?.[0]?.text;

      if (!reply) {
        console.error('Unexpected OpenAI response format:', response.data);
        throw new InternalServerErrorException('AI response is invalid.');
      }

      return reply;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error(
        'Error communicating with OpenAI API:',
        axiosError.response?.data || axiosError.message,
      );
      throw new InternalServerErrorException(
        'Failed to fetch AI response. Please try again.',
      );
    }
  }
}
