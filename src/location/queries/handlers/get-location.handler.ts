import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Location } from '../../entities/location.entity';
import { LocationService } from '../../location.service';
import { GetLocationQuery } from '../get-location.query';

@QueryHandler(GetLocationQuery)
export class GetLocationHandler implements IQueryHandler<GetLocationQuery> {
  constructor(private readonly locationService: LocationService) {}

  async execute(query: GetLocationQuery): Promise<Location> {
    return await this.locationService.findById(query.id);
  }
} 