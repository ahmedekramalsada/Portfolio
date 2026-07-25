import { IsString, IsOptional, IsNumber } from 'class-validator';

export class QueryDto {
  @IsString()
  query!: string;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class ReindexDto {
  @IsOptional()
  @IsString()
  sourceType?: string;

  @IsOptional()
  @IsString()
  sourceId?: string;
}
