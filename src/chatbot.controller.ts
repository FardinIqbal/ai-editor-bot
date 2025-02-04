import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

/**
 * Controller for AI-powered content summarization and SEO suggestions.
 */
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  /**
   * Endpoint to summarize an article.
   * @param {string} text - The article text to summarize.
   * @returns {Promise<{ summary: string }>} - The summarized text.
   */
  @Post('summarize')
  async summarize(@Body('text') text: string): Promise<{ summary: string }> {
    const summary = await this.chatbotService.summarizeText(text);
    return { summary };
  }

  /**
   * Endpoint to extract SEO-friendly keywords from an article.
   * @param {string} text - The article text to analyze.
   * @returns {Promise<{ keywords: string[] }>} - Extracted keywords.
   */
  @Post('keywords')
  async extractKeywords(
    @Body('text') text: string,
  ): Promise<{ keywords: string[] }> {
    const keywords = await this.chatbotService.extractKeywords(text);
    return { keywords };
  }
}
