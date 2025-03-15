import { Command, ICommandHandler } from '@nestjs/cqrs';
import { IsString, IsOptional, IsUUID, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';
import { BuildingService } from '../building.service';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBuildingCommand {
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({
    example: 'Main Office Building',
    description: 'The name of the building',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  readonly name?: string;

  constructor(
    id: string,
    name?: string,
  ) {
    this.id = id;
    this.name = name;
  }
}

export class UpdateBuildingHandler implements ICommandHandler<UpdateBuildingCommand> {
  constructor(
    private readonly buildingService: BuildingService
  ) { }
  async execute(command: UpdateBuildingCommand) {
    const building = await this.buildingService.validateBuildingExists(command.id);

    if (command.name) building.name = command.name;
    building.updatedAt = new Date();

    return await this.buildingService.update(building.id, building);
  }
} 