import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {User} from "./entities/user.entity";

@Injectable()
export class UsersService {
  private readonly items: User[] = [];

  create(createItemDto: CreateUserDto) {
    const item: User = {id: this.items.length, ...createItemDto};
    this.items.push(item);
  }

  findOne(id: number) {
    return this.items[id];
  }
}
