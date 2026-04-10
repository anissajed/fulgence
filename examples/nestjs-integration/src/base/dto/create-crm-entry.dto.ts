import {CreateAccountDto} from "#src/accounts/dto/create-account.dto";
import {CreateLeadDto} from "#src/leads/dto/create-lead.dto";
import {IntersectionType} from "@nestjs/mapped-types";

export class CreateCRMEntryDto extends IntersectionType(
  CreateLeadDto,
  CreateAccountDto,
) {}
