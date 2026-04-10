import { Injectable } from '@nestjs/common';
import {withFulgence} from "#src/fulgence/with-fulgence";
import { CreateLeadDto } from './dto/create-lead.dto';
import {Lead} from "./entities/lead.entity";

@Injectable()
@withFulgence({task_name: "LeadsService"})
export class LeadsService {
  private readonly items: Lead[] = [];

  async create(createItemDto: CreateLeadDto) {
    const id = this.items.length;
    const item: Lead = {id, ...createItemDto};
    this.items.push(item);
    return id;
  }

  async findOne(id: number) {
    return this.items[id];
  }
}
