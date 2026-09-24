import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  subject?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(10_000)
  message!: string;

  /** Honeypot: browsers keep it empty; automated submissions must not. */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}
