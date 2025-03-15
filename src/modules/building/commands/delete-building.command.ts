import { IsUUID, IsNotEmpty } from 'class-validator';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BuildingService } from '../building.service';

export class DeleteBuildingCommand {
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class DeleteBuildingHandler implements ICommandHandler<DeleteBuildingCommand> {
  constructor(
    private readonly buildingService: BuildingService
  ) { }
  async execute(command: DeleteBuildingCommand) {
    const building = await this.buildingService.validateBuildingExists(command.id);
    await this.buildingService.delete(building.id);
    return true;
  }
} 