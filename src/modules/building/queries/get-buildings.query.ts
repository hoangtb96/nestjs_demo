import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { BuildingService } from '../building.service';
import { GetBuildingRequestQuery } from './get-buildings.request-query';
import { Building } from '../../../entities/building.entity';
import { GetBuildingQueryResponse } from '../response/get-buildings.reponse';
import { BuildingResponse } from '../response/building.response';

export class GetBuildingsQuery {
    constructor(public readonly query: GetBuildingRequestQuery) { }
}

@QueryHandler(GetBuildingsQuery)
export class GetBuildingsHandler implements IQueryHandler<GetBuildingsQuery> {
    constructor(@InjectRepository(Building)
    private buildingRepository: Repository<Building>, private readonly buildingService: BuildingService) { }

    async execute(
        query: GetBuildingsQuery,
    ): Promise<GetBuildingQueryResponse> {

        const { search, take, skip } = query.query;
        const whereCondition = search ? [{ name: ILike(`%${search}%`) }] : {};

        const [buildings, total] = await this.buildingRepository.findAndCount({
            where: whereCondition,
            skip,
            take,
            order: { name: 'ASC' },
            select: {
                id: true,
            },
        });
        const buildingIds = buildings.map((item) => item.id);
        const data = await this.buildingService.getBuildingsTree(buildingIds);

        return { data, total };
    }
}