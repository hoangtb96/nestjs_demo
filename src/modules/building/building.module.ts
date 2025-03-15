import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteBuildingHandler } from './commands/delete-building.command';
import { UpdateBuildingHandler } from './commands/update-building.command';
import { CreateBuildingHandler } from './commands/create-building.command';
import { GetBuildingHandler } from './queries/get-building.query';
import { GetBuildingsHandler } from './queries/get-buildings.query';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';
import { Building } from '../../entities/building.entity';
import { Location } from '../../entities/location.entity';
const CommandHandlers = [
  CreateBuildingHandler,
  UpdateBuildingHandler,
  DeleteBuildingHandler,
];

const QueryHandlers = [
  GetBuildingHandler,
  GetBuildingsHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Location, Building]),
  ],
  controllers: [BuildingController],
  providers: [
    BuildingService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class BuildingModule {} 