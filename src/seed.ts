import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LocationService } from './modules/location/location.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const locationService = app.get(LocationService);

    try {
        // Create Building A and its main locations
        const buildingA = await locationService.createLocation(
            'Car Park',
            'A-CarPark',
            '80.620 m2',
            undefined,
            'Building A'
        );

        const levelA1 = await locationService.createLocation(
            'Level 1',
            'A-01',
            '100.920 m2',
            buildingA.building.id,
            undefined,
            buildingA.id
        );

        // Create Level 1 sub-locations
        const lobbyA1 = await locationService.createLocation(
            'Lobby Level1',
            'A-01-Lobby',
            '80.620 m2',
            buildingA.building.id,
            undefined,
            levelA1.id
        );

        const masterRoom = await locationService.createLocation(
            'Master Room',
            'A-01-01',
            '50.110 m2',
            buildingA.building.id,
            undefined,
            levelA1.id
        );

        // Create Meeting Room under Master Room
        await locationService.createLocation(
            'Meeting Room 1',
            'A-01-01-M1',
            '20.110 m2',
            buildingA.building.id,
            undefined,
            masterRoom.id
        );

        // Create other Level 1 locations
        await locationService.createLocation(
            'Corridor Level 1',
            'A-01-Corridor',
            '30.200 m2',
            buildingA.building.id,
            undefined,
            levelA1.id
        );

        await locationService.createLocation(
            'Toilet Level 1',
            'A-01-02',
            '30.200 m2',
            buildingA.building.id,
            undefined,
            levelA1.id
        );

        // Create Building B and Level 5
        const buildingB = await locationService.createLocation(
            'Level 5',
            'B-05',
            '150.000 m2',
            undefined,
            'Building B'
        );

        // Create Level 5 sub-locations
        await locationService.createLocation(
            'Utility Room',
            'B-05-11',
            '10.200 m2',
            buildingB.building.id,
            undefined,
            buildingB.id
        );

        await locationService.createLocation(
            'Sanitary Room',
            'B-05-12',
            '12.200 m2',
            buildingB.building.id,
            undefined,
            buildingB.id
        );

        await locationService.createLocation(
            'Male Toilet',
            'B-05-13',
            '30.200 m2',
            buildingB.building.id,
            undefined,
            buildingB.id
        );

        await locationService.createLocation(
            'Genset Room',
            'B-05-14',
            '35.200 m2',
            buildingB.building.id,
            undefined,
            buildingB.id
        );

        await locationService.createLocation(
            'Pantry Level 5',
            'B-05-15',
            '50.200 m2',
            buildingB.building.id,
            undefined,
            buildingB.id
        );

        await locationService.createLocation(
            'Corridor Level 5',
            'B-05-Corridor',
            '30.000 m2',
            buildingB.building.id,
            undefined,
            buildingB.id
        );

        console.log('Seed data created successfully');
    } catch (error) {
        console.error('Error creating seed data:', error);
    } finally {
        await app.close();
    }
}

bootstrap(); 