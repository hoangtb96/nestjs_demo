import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Location } from '../../entities/location.entity';
import { LocationService } from '../../location.service';
import { GetLocationsQuery } from '../get-locations.query';

@QueryHandler(GetLocationsQuery)
export class GetLocationsHandler implements IQueryHandler<GetLocationsQuery> {
  constructor(private readonly locationService: LocationService) {}

  async execute(): Promise<Location[]> {
    return await this.locationService.findAll();
  }
} 