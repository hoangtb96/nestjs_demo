import { Entity, PrimaryGeneratedColumn, Column, Tree, TreeChildren, TreeParent, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Building } from '../entities/building.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('locations')
@Tree("materialized-path")
export class Location extends BaseEntity {
    @ApiProperty({ description: 'The unique identifier of the location' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The name of the location' })
    @Column()
    name: string;

    @ApiProperty({ description: 'The unique location number' })
    @Column({ name: 'location_number', unique: true })
    locationNumber: string;

    @ApiProperty({ description: 'The area of the location' })
    @Column()
    area: string;

    @ApiProperty({ description: 'The building this location belongs to' })
    @ManyToOne(() => Building, building => building.locations)
    building: Building;

    @ApiPropertyOptional({ description: 'Child locations', type: () => [Location] })
    @TreeChildren()
    children: Location[];

    @ApiPropertyOptional({ description: 'Parent location', type: () => Location })
    @TreeParent()
    parent: Location;
}