import { NestFactory } from '@nestjs/core';
import {AnyModule, appModuleFactory} from './app.module.js';

export async function bootstrap({
  port = process.env.PORT ?? 3000,
  extra_modules = [] as AnyModule[],
} = {}) {
  const AppModule = appModuleFactory({extra_modules});
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  return app;
}
