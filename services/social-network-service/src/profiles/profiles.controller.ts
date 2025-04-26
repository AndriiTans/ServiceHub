import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from './profile.schema';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Post()
  create(@Body() createUserDto: Partial<Profile>) {
    return this.profilesService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: Partial<Profile>) {
    return this.profilesService.update(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.profilesService.delete(id);
  }
}