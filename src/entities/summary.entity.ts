import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * Entity representing an AI-generated summary stored in PostgreSQL.
 */
@Entity()
export class Summary {
  /**
   * Unique identifier for each summary entry.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Original text input provided by the user.
   */
  @Column({ type: 'text' })
  inputText: string;

  /**
   * AI-generated summarized version of the input text.
   */
  @Column({ type: 'text' })
  summary: string;

  /**
   * Extracted SEO-friendly keywords from the input text.
   */
  @Column({ type: 'text', array: true, nullable: true })
  keywords: string[];

  /**
   * Timestamp indicating when the summary was created.
   */
  @CreateDateColumn()
  createdAt: Date;
}
