import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBuildingCommand } from '../delete-building.command';
import { BuildingService } from '../../building.service';
import { Injectable } from '@nestjs/common';
import { validateCommand } from 'src/common/middleware/command-validator.middleware';

@Injectable()
@CommandHandler(DeleteBuildingCommand)
export class DeleteBuildingHandler implements ICommandHandler<DeleteBuildingCommand> {
  constructor(private readonly buildingService: BuildingService) {}

  async execute(command: DeleteBuildingCommand) {
    // Validate command
    await validateCommand(command);

    // Validate building exists
    await this.buildingService.validateBuildingExists(command.id);

    // Execute command
    return await this.buildingService.delete(command.id);
  }
} 