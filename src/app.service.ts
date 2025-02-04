import { Injectable } from '@nestjs/common';

/**
 * Service that provides the logic for the root endpoint message.
 */
@Injectable()
export class AppService {
  /**
   * Returns a welcome message for the root endpoint.
   *
   * @returns A string containing the welcome message.
   */
  getHello(): string {
    return 'Welcome to the AI Editor Bot!';
  }
}
