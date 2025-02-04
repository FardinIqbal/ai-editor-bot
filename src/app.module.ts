import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

/**
 * The root module of the application.
 * Registers services, controllers, and configuration settings.
 */
@Module({
  imports: [ConfigModule.forRoot()], // Enable .env configuration
  controllers: [AppController, ChatbotController], // Register AppController
  providers: [AppService, ChatbotService], // Register AppService
})
export class AppModule {}
