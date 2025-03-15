import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLocationCommand } from '../create-location.command';
import { LocationService } from '../../location.service';

@CommandHandler(CreateLocationCommand)
export class CreateLocationHandler implements ICommandHandler<CreateLocationCommand> {
    constructor(private readonly locationService: LocationService) {}

    async execute(command: CreateLocationCommand) {
        const { name, locationNumber, area, buildingId, buildingName, parentId } = command;
        return this.locationService.createLocation(
            name,
            locationNumber,
            area,
            buildingId,
            buildingName,
            parentId
        );
    }
}