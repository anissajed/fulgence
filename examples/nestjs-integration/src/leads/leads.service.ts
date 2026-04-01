import { Injectable } from '@nestjs/common';
import {withFulgence} from "#src/fulgence/with-fulgence";
import { CreateLeadDto } from './dto/create-lead.dto';
import {Lead} from "./entities/lead.entity";

@Injectable()
@withFulgence({task_name: "LeadsService"})
export class LeadsService {
  private readonly items: Lead[] = [];

  create(createItemDto: CreateLeadDto) {
    const item: Lead = {id: this.items.length, ...createItemDto};
    this.items.push(item);
  }

  findOne(id: number) {
    return this.items[id];
  }
}
