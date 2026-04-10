import { Controller, Get, Post, Body } from '@nestjs/common';
import {BaseService} from './base.service';
import {CreateCRMEntryDto} from "./dto/create-crm-entry.dto";


@Controller("")
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  @Get()
  getLastCRMEntry(): string {
    return this.baseService.getLastCRMEntry();
  }

  @Post()
  async addCRMEntry(@Body() createCRMEntryDto: CreateCRMEntryDto): Promise<string> {
console.log("BaseController.addCRMEntry (Post)", {createCRMEntryDto});
    const res = await this.baseService.addCRMEntry(createCRMEntryDto);
    return res;
  }
}
