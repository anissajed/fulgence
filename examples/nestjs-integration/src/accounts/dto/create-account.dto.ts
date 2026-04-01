import {Omit} from "#src/utils";
import {Account} from "../entities/account.entity";

export class CreateAccountDto extends Omit(Account, ["id"]) {}
