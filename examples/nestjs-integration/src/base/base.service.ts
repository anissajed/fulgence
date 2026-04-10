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
  ) {
console.log("BaseService constructor", {leadsService, accountsService});
  }

  getLastCRMEntry(): string {
// TODO return a pipeline instance, with the associated account instanceand lead instance.
return 'Hello World!';
  }

  async addCRMEntry(createCRMEntry: CreateCRMEntryDto): Promise<string> {
const {leadsService, accountsService} = this;
console.log("BaseService.addCRMEntry", {createCRMEntry, leadsService, accountsService});
    const {firstName, lastName, accountName} = createCRMEntry;
    const leadId = await this.leadsService.create({firstName, lastName});
    const lead = await this.leadsService.findOne(leadId);
    
    const accountId = await this.accountsService.create({accountName});
    const account = await this.accountsService.findOne(accountId);
    
console.log("BaseService.addCRMEntry", {lead, account});
// TODO when a new lead is created, the user enters also its account (company), and this app also initiates the follow-up data. Return sth like {id: <pipeline id>, status: "Started"}.
    return 'Hello World!';
  }
}
