import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import {Account} from "./entities/account.entity";
import {withFulgence} from "#src/fulgence/with-fulgence";

@Injectable()
@withFulgence({task_name: "AccountsService"})
export class AccountsService {
  private readonly items: Account[] = [];

  async create(createItemDto: CreateAccountDto) {
    const id = this.items.length;
    const item: Account = {id, ...createItemDto};
    this.items.push(item);
    return id;
  }

  async findOne(id: number) {
    return this.items[id];
  }
}
