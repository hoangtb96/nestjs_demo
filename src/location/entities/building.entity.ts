import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Location } from './location.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('buildings')
export class Building extends BaseEntity {
    @ApiProperty({ description: 'The unique identifier of the building' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The name of the building' })
    @Column()
    name: string;

    @ApiProperty({ description: 'The locations in this building', type: () => [Location] })
    @OneToMany('Location', 'building')
    locations: Location[];
} 