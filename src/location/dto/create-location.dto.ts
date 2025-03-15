import { IsString, IsOptional, Length, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ description: 'The name of the location' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The unique location number' })
  @IsString()
  locationNumber: string;

  @ApiProperty({ description: 'The area of the location' })
  @IsString()
  area: string;

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