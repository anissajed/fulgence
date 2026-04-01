import { Injectable } from '@nestjs/common';
import {AccountsService} from "#src/accounts/accounts.service";
import {withFulgence} from "#src/fulgence/with-fulgence";
import {LeadsService} from "#src/leads/leads.service";
import {CreateCRMEntryDto} from "./dto/create-crm-entry.dto";

@Injectable()
@withFulgence({task_name: "BaseService"})
export class BaseService {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly accountsService: AccountsService
  ) {}

  getLastCRMEntry(): string {
// TODO return a pipeline instance, with the associated account instanceand lead instance.
return 'Hello World!';
  }

  addCRMEntry(createCRMEntry: CreateCRMEntryDto): string {
// TODO when a new lead is created, the user enters also its account (company), and this app also initiates the follow-up data. Return sth like {id: <pipeline id>, status: "Started"}.
    return 'Hello World!';
  }
}
