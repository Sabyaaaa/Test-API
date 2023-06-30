// person.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { Person } from '.prisma/client';
import { PersonService } from './person.service';

@Controller('people')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  async create(@Body() createPersonDto: { name: string; age: number }): Promise<Person> {
    const { name, age } = createPersonDto;
    return this.personService.create(name, age);
  }

  @Get()
  async findAll(): Promise<Person[]> {
    return this.personService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Person> {
    return this.personService.findById(Number(id));
  }
}
