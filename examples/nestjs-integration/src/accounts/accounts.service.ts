import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import {Account} from "./entities/account.entity";
import {withFulgence} from "#src/fulgence/with-fulgence";

@Injectable()
@withFulgence({task_name: "AccountsService"})
export class AccountsService {
  private readonly items: Account[] = [];

  create(createItemDto: CreateAccountDto) {
    const item: Account = {id: this.items.length, ...createItemDto};
    this.items.push(item);
  }

  findOne(id: number) {
    return this.items[id];
  }
}
