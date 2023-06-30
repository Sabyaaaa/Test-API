// person.service.ts
import { Injectable } from '@nestjs/common';
import { Person } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PersonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, age: number): Promise<Person> {
    return this.prisma.person.create({
      data: { name, age },
    });
  }

  async findAll(): Promise<Person[]> {
    return this.prisma.person.findMany();
  }

  async findById(id: number): Promise<Person> {
    return this.prisma.person.findUnique({
      where: { id },
    });
  }
}
