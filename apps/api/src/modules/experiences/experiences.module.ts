import { Module } from '@nestjs/common';
import { ExperiencesController } from './experiences.controller';

@Module({ controllers: [ExperiencesController] })
export class ExperiencesModule {}
