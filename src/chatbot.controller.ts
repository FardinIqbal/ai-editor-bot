import { Controller, Post, Body, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatbotService } from './chatbot.service';
import { Summary } from './entities/summary.entity';

/**
 * Controller handling AI-powered text summarization and SEO keyword extraction.
 */
@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    @InjectRepository(Summary)
    private readonly summaryRepo: Repository<Summary>,
  ) {}

  /**
   * Endpoint for summarizing an article.
   * @param {string} text - The input text to summarize.
   * @returns {Promise<{ summary: string }>} - AI-generated summary.
   */
  @Post('summarize')
  async summarize(@Body('text') text: string): Promise<{ summary: string }> {
    const summary = await this.chatbotService.summarizeText(text);
    return { summary };
  }

  /**
   * Endpoint for extracting SEO-friendly keywords.
   * @param {string} text - The input text to analyze.
   * @returns {Promise<{ keywords: string[] }>} - List of extracted keywords.
   */
  @Post('keywords')
  async extractKeywords(
    @Body('text') text: string,
  ): Promise<{ keywords: string[] }> {
    const keywords = await this.chatbotService.extractKeywords(text);
    return { keywords };
  }

  /**
   * Retrieves the most recent 10 stored summaries and keywords.
   * @returns {Promise<Summary[]>} - List of stored summaries and keywords.
   */
  @Get('history')
  async getHistory(): Promise<Summary[]> {
    return this.summaryRepo.find({
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }
}
