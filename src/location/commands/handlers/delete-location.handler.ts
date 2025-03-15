import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LocationService } from '../../location.service';
import { DeleteLocationCommand } from '../delete-location.command';

@CommandHandler(DeleteLocationCommand)
export class DeleteLocationHandler implements ICommandHandler<DeleteLocationCommand> {
  constructor(private readonly locationService: LocationService) {}

  async execute(command: DeleteLocationCommand): Promise<void> {
    await this.locationService.deleteLocation(command.id);
  }
} 