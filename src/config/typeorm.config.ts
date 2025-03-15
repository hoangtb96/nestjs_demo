import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Location } from '../entities/location.entity';
import { Building } from '../entities/building.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BaseEntity } from '../common/entities/base.entity';

config(); // Load environment variables

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'location_service',
    entities: [Location, Building, BaseEntity],
    migrations: ['dist/migrations/*.js'],
    synchronize: process.env.NODE_ENV !== 'production', // Disable in production
    logging: process.env.NODE_ENV !== 'production',
};

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'location_service',
    entities: [Location, Building, BaseEntity],
    migrations: ['dist/migrations/*{.ts,.js}'],
    synchronize: false,
});
export default dataSource; 