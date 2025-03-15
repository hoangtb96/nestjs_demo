import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBuildingCommand } from '../create-building.command';
import { BuildingService } from '../../building.service';
import { Injectable } from '@nestjs/common';
import { validateCommand } from 'src/common/middleware/command-validator.middleware';

@Injectable()
@CommandHandler(CreateBuildingCommand)
export class CreateBuildingHandler implements ICommandHandler<CreateBuildingCommand> {
  constructor(private readonly buildingService: BuildingService) {}

  async execute(command: CreateBuildingCommand) {
    // Validate command
    await validateCommand(command);

    // Check if building name is unique
    await this.buildingService.validateUniqueName(command.name);

    // Execute command
    return await this.buildingService.create({
      name: command.name,
    });
  }
} 