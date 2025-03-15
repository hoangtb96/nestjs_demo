import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from '../../entities/building.entity';
import { In, Repository } from 'typeorm';
import { Location } from '../../entities/location.entity';
import { BuildingNotFoundException } from '../../common/exceptions/building-not-found.exception';
import { LocationNotFoundException } from '../../common/exceptions/location-not-found.exception';
import { DuplicateNameException } from '../../common/exceptions/duplicate-name.exception';

@Injectable()
export class BuildingService {
    constructor(
        @InjectRepository(Building)
        private readonly buildingRepository: Repository<Building>,
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
    ) { }

    async create(data: {
        name: string;
    }): Promise<Building> {
        const existingBuilding = await this.buildingRepository.findOne({
            where: { name: data.name }
        });

        if (existingBuilding) {
            throw new DuplicateNameException('Building', data.name);
        }

        const building = this.buildingRepository.create({
            ...data,
        });

        return await this.buildingRepository.save(building);
    }

    async update(id: string, data: {
        name?: string;
    }): Promise<Building> {
        const building = await this.buildingRepository.findOne({
            where: { id }
        });

        if (!building) {
            throw new NotFoundException('Building not found');
        }

        // Check if new name conflicts with existing building
        if (data.name && data.name !== building.name) {
            const existingBuilding = await this.buildingRepository.findOne({
                where: { name: data.name }
            });

            if (existingBuilding) {
                throw new BadRequestException('Building with this name already exists');
            }
        }

        // Update only provided fields
        Object.assign(building, {
            ...data,
            updatedAt: new Date()
        });

        return await this.buildingRepository.save(building);
    }

    async delete(id: string): Promise<void> {
        const building = await this.buildingRepository.findOne({
            where: { id }
        });

        if (!building) {
            throw new NotFoundException('Building not found');
        }

        const result = await this.buildingRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`The building with ID ${id} not found`);
        }
    }

    async findById(id: string): Promise<Building> {
        const building = await this.buildingRepository.findOne({
            where: { id }
        });

        if (!building) {
            throw new BuildingNotFoundException(id);
        }

        return building;
    }

    async getBuildingsTree(buildingIds: string[]) {
        const buildings = await this.buildingRepository.find({
            where: { id: In(buildingIds) },
            relations: ['locations'],
        });

        if (!buildings || buildings.length === 0) {
            throw new Error('No buildings found');
        }

        const treeBuildings = buildings.map((building) => {
            const locations = building.locations;

            const locationMap = new Map<string, Location>();
            const rootLocations: Location[] = [];


            locations.forEach((location) => {
                location.children = [];
                locationMap.set(location.id, location);
            });

            locations.forEach((location) => {
                if (location.parentId) {
                    const parent = locationMap.get(location.parentId);
                    if (parent) {
                        parent.children.push(location);
                    }
                } else {
                    rootLocations.push(location);
                }
            });

            console.log('rootLocations', rootLocations);


            return {
                ...building,
                locations: rootLocations,
            };
        });

        return treeBuildings;

    }

    async validateBuildingExists(id: string): Promise<Building> {
        const building = await this.buildingRepository.findOne({
            where: { id }
        });

        if (!building) {
            throw new NotFoundException('Building not found');
        }

        return building;
    }

    async getBuildingsByIds(ids: string[]): Promise<Building[]> {
        return await this.buildingRepository.findByIds(ids);
    }

    async isNameUnique(name: string, excludeId?: string): Promise<boolean> {
        const queryBuilder = this.buildingRepository.createQueryBuilder('building')
            .where('LOWER(buildings.name) = LOWER(:name)', { name });

        if (excludeId) {
            queryBuilder.andWhere('buildings.id != :id', { id: excludeId });
        }

        const count = await queryBuilder.getCount();
        return count === 0;
    }

    async validateUniqueName(name: string, excludeId?: string): Promise<void> {
        const queryBuilder = this.buildingRepository
            .createQueryBuilder('building')
            .where('LOWER(building.name) = LOWER(:name)', { name })
            .andWhere('building.deletedAt IS NULL');

        if (excludeId) {
            queryBuilder.andWhere('building.id != :id', { id: excludeId });
        }

        const exists = await queryBuilder.getCount();
        if (exists) {
            throw new BadRequestException('Building with this name already exists');
        }
    }
} 