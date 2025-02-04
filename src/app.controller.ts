import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Controller for handling root-level requests.
 * Provides a welcome message at the root endpoint.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Handles GET requests to the root endpoint (`/`).
   *
   * @returns A welcome message.
   */
  @Get()
  getRootMessage(): string {
    // Delegates the response logic to the AppService
    return this.appService.getHello();
  }
}
