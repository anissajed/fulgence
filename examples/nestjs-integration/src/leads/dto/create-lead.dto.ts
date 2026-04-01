import {Omit} from "#src/utils";
import {Lead} from "../entities/lead.entity";

export class CreateLeadDto extends Omit(Lead, ["id"]) {}
