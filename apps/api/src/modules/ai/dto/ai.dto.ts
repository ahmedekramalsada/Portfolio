import { IsString, IsOptional } from 'class-validator';

export class ChatDto {
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  model?: string;
}

export class SummarizeDto {
  @IsString()
  content!: string;
}

export class SEODto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;
}
