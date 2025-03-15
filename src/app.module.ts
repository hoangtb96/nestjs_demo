import { Module } from '@nestjs/common';
import  {typeOrmConfig} from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationModule } from './modules/location/location.module';
import { BuildingModule } from './modules/building/building.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    LocationModule,
    BuildingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
