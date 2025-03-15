import { ApiProperty } from "@nestjs/swagger";
import { Location } from "src/entities/location.entity";

export class BuildingResponse {
  @ApiProperty({
    description: 'location id',
    example: 2,
  })
  id!: string;

  @ApiProperty({
    description: 'name of building',
    example: 'building A',
  })
  name!: string;

  @ApiProperty({
    description: 'locations',
    example: [],
  })
  locations!: Location[];

  @ApiProperty({
    description: 'updated at',
    example: '2025-03-15T00:00:00.000Z',
  })
  updatedAt!: Date;
  @ApiProperty({
    description: 'created at',
    example: '2025-03-15T00:00:00.000Z',
  })
  createdAt!: Date;
}