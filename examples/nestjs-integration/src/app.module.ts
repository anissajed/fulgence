import { MiddlewareConsumer, Module, NestModule, Type, DynamicModule } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import {AccountsModule} from "#src/accounts/accounts.module";
import {LeadsModule} from "#src/leads/leads.module";
import {PipelinesModule} from "#src/pipelines/pipelines.module";
import {BaseModule} from "#src/base/base.module";

export type AnyModule = Type<any> | DynamicModule;

export const appModuleFactory = ({extra_modules = []}: {extra_modules?: AnyModule[]} = {}) => {
  @Module({
    imports: [
      AccountsModule,
      LeadsModule,
      PipelinesModule,
      BaseModule,
      ...extra_modules
    ],
  })
  class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }

  return AppModule;
};
