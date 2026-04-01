import { Module } from '@nestjs/common';
import { BaseService } from './base.service';
import { BaseController } from './base.controller';
import {AccountsModule} from "#src/accounts/accounts.module";
import {LeadsModule} from "#src/leads/leads.module";

@Module({
  imports: [
    AccountsModule,
    LeadsModule,
  ],
  controllers: [BaseController],
  providers: [BaseService],
})
export class BaseModule {}
