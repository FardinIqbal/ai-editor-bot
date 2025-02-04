import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

/**
 * Controller to handle chatbot-related API requests.
 */
@Controller('chat')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  /**
   * POST endpoint to interact with the chatbot.
   *
   * @param message - The user's input message.
   * @returns The AI-generated response.
   */
  @Post()
  async chat(@Body('message') message: string): Promise<{ reply: string }> {
    const reply = await this.chatbotService.chatWithAI(message);
    return { reply };
  }
}
