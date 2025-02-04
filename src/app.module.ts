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
    ConfigModule.forRoot({
      isGlobal: true, // Ensures ConfigModule is available throughout the app
      envFilePath: ['.env'], // Load environment variables from .env file
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // PostgreSQL connection string
      autoLoadEntities: true, // Automatically loads all entity files
      synchronize: process.env.NODE_ENV !== 'production', // Set to false in production to avoid schema overwrites
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Enables SSL for secure DB connections
    }),
    TypeOrmModule.forFeature([Summary]), // Registers the Summary entity for repository access
  ],
  controllers: [AppController, ChatbotController], // Registers application controllers
  providers: [AppService, ChatbotService], // Registers services
})
export class AppModule {}
