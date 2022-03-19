import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

// nest olha para o modulo, encontra todos os controllers listados no modulo
// e cria uma instancia de todos os controllers automaticamente, depois olha
// todos os decorators de tipo de requisição GET, POST..., e configura handlers
// para cada um deles
@Module({
  controllers: [AppController]
})
export class AppModule {}
