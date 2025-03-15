import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLocationCommand } from '../update-location.command';
import { LocationService } from '../../location.service';

@CommandHandler(UpdateLocationCommand)
export class UpdateLocationHandler implements ICommandHandler<UpdateLocationCommand> {
    constructor(private readonly locationService: LocationService) {}

    async execute(command: UpdateLocationCommand) {
        const { id, name, locationNumber, area, buildingId, buildingName, parentId } = command;
        return this.locationService.updateLocation(
            id,
            name,
            locationNumber,
            area,
            buildingId,
            buildingName,
            parentId
        );
    }
} 