// app.module.ts
import { Module } from '@nestjs/common';
import { PersonController } from './PersonService/person.controller';
import { PersonService } from './PersonService/person.service';
import { PrismaService } from './prisma/prisma.service';
// import { PrismaService } from './prisma.service';
// import { PersonController } from './person.controller';
// import { PersonService } from './person.service';

@Module({
  controllers: [PersonController],
  providers: [PersonService, PrismaService],
})
export class AppModule {}
