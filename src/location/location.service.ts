import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository, Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { Building } from './entities/building.entity';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(Location)
        private readonly locationRepository: TreeRepository<Location>,
        @InjectRepository(Building)
        private readonly buildingRepository: Repository<Building>
    ) {}

    async createLocation(
        name: string,
        locationNumber: string,
        area: string,
        buildingId?: string,
        buildingName?: string,
        parentId?: string
    ): Promise<Location> {
        let building: Building;

        if (buildingId) {
            building = await this.buildingRepository.findOne({ where: { id: buildingId } });
            if (!building && buildingName) {
                // If building doesn't exist but name is provided, create a new one
                building = this.buildingRepository.create({
                    name: buildingName
                });
                building = await this.buildingRepository.save(building);
            }
        } else if (buildingName) {
            // If only building name is provided, create a new building
            building = this.buildingRepository.create({
                name: buildingName
            });
            building = await this.buildingRepository.save(building);
        }

        const location = this.locationRepository.create({
            name,
            locationNumber,
            area,
            building
        });

        if (parentId) {
            const parent = await this.locationRepository.findOne({ where: { id: parentId } });
            if (parent) {
                location.parent = parent;
            }
        }

        return this.locationRepository.save(location);
    }

    async updateLocation(
        id: string,
        name?: string,
        locationNumber?: string,
        area?: string,
        buildingId?: string,
        buildingName?: string,
        parentId?: string,
    ): Promise<Location> {
        const location = await this.findById(id);

        if (name) {
            location.name = name;
        }
        if (locationNumber) {
            location.locationNumber = locationNumber;
        }
        if (area) {
            location.area = area;
        }

        // Handle building update
        if (buildingId || buildingName) {
            let building: Building;

            if (buildingId) {
                building = await this.buildingRepository.findOne({ where: { id: buildingId } });
                if (!building && buildingName) {
                    // If building doesn't exist but name is provided, create a new one
                    building = this.buildingRepository.create({
                        name: buildingName
                    });
                    building = await this.buildingRepository.save(building);
                }
            } else if (buildingName) {
                // If only building name is provided, create a new building
                building = this.buildingRepository.create({
                    name: buildingName
                });
                building = await this.buildingRepository.save(building);
            }

            if (building) {
                location.building = building;
            }
        }

        if (parentId) {
            const parent = await this.findById(parentId);
            location.parent = parent;
        }

        return await this.locationRepository.save(location);
    }

    async deleteLocation(id: string): Promise<void> {
        const location = await this.locationRepository.findOne({
            where: { id },
            relations: ['building', 'children', 'parent']
        });

        if (!location) {
            throw new NotFoundException(`Location with ID "${id}" not found`);
        }

        // Remove the location from its building's locations array
        if (location.building) {
            location.building = null;
            await this.locationRepository.save(location);
        }

        // Handle children locations
        if (location.children && location.children.length > 0) {
            // Either move children to parent or delete them based on your requirements
            if (location.parent) {
                // Move children to parent
                for (const child of location.children) {
                    child.parent = location.parent;
                    await this.locationRepository.save(child);
                }
            } else {
                // Delete children if no parent exists
                await this.locationRepository.remove(location.children);
            }
        }

        await this.locationRepository.remove(location);
    }

    async findById(id: string): Promise<Location> {
        const location = await this.locationRepository.findOne({
            where: { id },
            relations: ['building', 'children', 'parent'],
        });

        if (!location) {
            throw new NotFoundException(`Location with ID "${id}" not found`);
        }

        return location;
    }

    async findAll(): Promise<Location[]> {
        return await this.locationRepository.find({
            relations: ['building']
        });
    }

    async getTree(): Promise<Location[]> {
        return await this.locationRepository.findTrees();
    }

    async getChildren(id: string): Promise<Location[]> {
        const location = await this.findById(id);
        const tree = await this.locationRepository.findDescendantsTree(location);
        return tree.children || [];
    }

    async getParents(id: string): Promise<Location[]> {
        const location = await this.findById(id);
        return await this.locationRepository.findAncestors(location);
    }
} 