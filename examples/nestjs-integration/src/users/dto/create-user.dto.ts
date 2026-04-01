import {Omit} from "#src/utils";
import {User} from "../entities/user.entity";

export class CreateUserDto extends Omit(User, ["id"]) {}
