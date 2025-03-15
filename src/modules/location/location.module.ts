import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { LocationController } from './location.controller';
import { Location } from '../../entities/location.entity';
import { Building } from '../../entities/building.entity';
import { LocationService } from './location.service';

// Command Handlers
import { CreateLocationHandler } from './commands/handlers/create-location.handler';
import { UpdateLocationHandler } from './commands/handlers/update-location.handler';
import { DeleteLocationHandler } from './commands/handlers/delete-location.handler';

// Query Handlers
import { GetLocationHandler } from './queries/handlers/get-location.handler';
import { GetLocationsHandler } from './queries/handlers/get-locations.handler';
import { GetLocationTreeHandler } from './queries/handlers/get-location-tree.handler';

const CommandHandlers = [
  CreateLocationHandler,
  UpdateLocationHandler,
  DeleteLocationHandler,
];

const QueryHandlers = [
  GetLocationHandler,
  GetLocationsHandler,
  GetLocationTreeHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Building]),
    CqrsModule,
  ],
  controllers: [LocationController],
  providers: [
    LocationService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class LocationModule {} 