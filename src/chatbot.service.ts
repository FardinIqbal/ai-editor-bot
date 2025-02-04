import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Summary } from './entities/summary.entity';

/**
 * Service for AI-powered content summarization and SEO keyword extraction.
 */
@Injectable()
export class ChatbotService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Summary)
    private readonly summaryRepo: Repository<Summary>,
  ) {}

  /**
   * Summarizes a given text using OpenAI's GPT model and stores it in the database.
   * @param {string} text - The input text to summarize.
   * @returns {Promise<string>} - The AI-generated summary.
   * @throws {InternalServerErrorException} - If the API request fails.
   */
  async summarizeText(text: string): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('AI service is not configured.');
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Summarize this content concisely.' },
            { role: 'user', content: text },
          ],
        },
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const summary = response.data.choices[0].message.content;

      // Save summary to database
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      await this.summaryRepo.save({ inputText: text, summary });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return summary;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error(
        'OpenAI API Error:',
        axiosError.response?.data || axiosError.message,
      );
      throw new InternalServerErrorException('Failed to fetch AI response.');
    }
  }

  /**
   * Extracts SEO-friendly keywords from the given text and stores them in the database.
   * @param {string} text - The input text to analyze.
   * @returns {Promise<string[]>} - Extracted keywords.
   * @throws {InternalServerErrorException} - If the API request fails.
   */
  async extractKeywords(text: string): Promise<string[]> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('AI service is not configured.');
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Extract 10 SEO-friendly keywords from this article.',
            },
            { role: 'user', content: text },
          ],
        },
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      const keywords = response.data.choices[0].message.content
        .split(',')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
        .map((keyword) => keyword.trim());

      // Save keywords to database
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      await this.summaryRepo.save({ inputText: text, summary: '', keywords });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return keywords;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error(
        'OpenAI API Error:',
        axiosError.response?.data || axiosError.message,
      );
      throw new InternalServerErrorException('Failed to fetch AI response.');
    }
  }
}
