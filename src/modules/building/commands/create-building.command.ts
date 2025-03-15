import { IsString, IsNotEmpty, IsUUID, MinLength, MaxLength, Matches } from 'class-validator';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BuildingService } from '../building.service';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBuildingCommand {
  @ApiProperty({
    example: 'Main Office Building',
    description: 'The name of the building',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  readonly name: string;

  constructor(
    name: string,
  ) {
    this.name = name;
  }
}

@CommandHandler(CreateBuildingCommand)
export class CreateBuildingHandler implements ICommandHandler<CreateBuildingCommand> {
  constructor(private readonly buildingService: BuildingService) { }

  async execute(command: CreateBuildingCommand) {
    return await this.buildingService.create({
      name: command.name,
    });
  }
} 