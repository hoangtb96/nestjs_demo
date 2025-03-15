import { IQuery, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Building } from '../../../entities/building.entity';

export class GetBuildingQuery implements IQuery {
  constructor(public readonly id: string) {}
}

export class GetBuildingHandler implements IQueryHandler<GetBuildingQuery> {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
  ) {}
  async execute(query: GetBuildingQuery) {
    const building = await this.buildingRepository.findOne({
      where: { id: query.id }
    });
    if (!building) {
      throw new NotFoundException('Building not found');
    }
    return building;
  }
} 