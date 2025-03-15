import { NotFoundException } from '@nestjs/common';

export class BuildingNotFoundException extends NotFoundException {
    constructor(buildingId?: string) {
        super(
            buildingId 
                ? `Building with ID "${buildingId}" not found` 
                : 'Building not found'
        );
    }
} 