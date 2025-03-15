import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Location } from '../../../../entities/location.entity';
import { LocationService } from '../../location.service';
import { GetLocationTreeQuery } from '../get-location-tree.query';

@QueryHandler(GetLocationTreeQuery)
export class GetLocationTreeHandler implements IQueryHandler<GetLocationTreeQuery> {
  constructor(private readonly locationService: LocationService) {}

  async execute(): Promise<Location[]> {
    return await this.locationService.getTree();
  }
} 