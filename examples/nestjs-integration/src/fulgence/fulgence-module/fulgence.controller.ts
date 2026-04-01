import {Controller, Post, Body} from '@nestjs/common';
import {FulgenceService} from './fulgence.service';

@Controller('fulgence')
export class FulgenceController {
  constructor(private readonly fulgenceService: FulgenceService) {}

  @Post()
  handle(@Body() payload: any) {
    return this.fulgenceService.handle(payload);
  }
}
