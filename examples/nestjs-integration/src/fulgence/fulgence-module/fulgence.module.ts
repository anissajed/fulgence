import { Module } from '@nestjs/common';
import { FulgenceService } from './fulgence.service';
import { FulgenceController } from './fulgence.controller.js';

@Module({
  controllers: [FulgenceController],
  providers: [FulgenceService],
})
export class FulgenceModule {}
