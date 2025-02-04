import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { Summary } from './entities/summary.entity';

/**
 * The root module of the application.
 * Registers services, controllers, database configuration, and application-wide settings.
 */
@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables from .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // PostgreSQL connection string
      autoLoadEntities: true, // Automatically load entities
      synchronize: true, // Set to false in production to avoid schema overwrites
    }),
    TypeOrmModule.forFeature([Summary]), // Register entity for repository usage
  ],
  controllers: [AppController, ChatbotController], // Register controllers
  providers: [AppService, ChatbotService], // Register services
})
export class AppModule {}
