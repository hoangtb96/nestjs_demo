import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class UpdateLocationDto {
    @ApiPropertyOptional({ description: 'The name of the location' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'The unique location number' })
    @IsString()
    @IsOptional()
    locationNumber?: string;

    @ApiPropertyOptional({ description: 'The area of the location' })
    @IsString()
    @IsOptional()
    area?: string;

    @ApiPropertyOptional({ description: 'The ID of the building this location belongs to' })
    @IsUUID()
    @IsOptional()
    buildingId?: string;

    @ApiPropertyOptional({ description: 'The name of the building (if creating a new one)' })
    @IsString()
    @IsOptional()
    buildingName?: string;

    @ApiPropertyOptional({ description: 'The ID of the parent location' })
    @IsUUID()
    @IsOptional()
    parentId?: string;
} 