import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBuildingCommand } from '../update-building.command';
import { BuildingService } from '../../building.service';
import { Injectable } from '@nestjs/common';
import { validateCommand } from 'src/common/middleware/command-validator.middleware';

@Injectable()
@CommandHandler(UpdateBuildingCommand)
export class UpdateBuildingHandler implements ICommandHandler<UpdateBuildingCommand> {
  constructor(private readonly buildingService: BuildingService) {}

  async execute(command: UpdateBuildingCommand) {
    // Validate command
    await validateCommand(command);

    // Validate building exists
    const building = await this.buildingService.validateBuildingExists(command.id);

    // Check if new name is unique (if name is being updated)
    if (command.name && command.name !== building.name) {
      await this.buildingService.validateUniqueName(command.name);
    }

    // Execute command
    return await this.buildingService.update(command.id, {
      name: command.name,
    });
  }
} 