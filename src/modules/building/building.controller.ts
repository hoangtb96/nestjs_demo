import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateBuildingCommand } from './commands/create-building.command';
import { GetBuildingsQuery } from './queries/get-buildings.query';
import { UpdateBuildingCommand } from './commands/update-building.command';
import { DeleteBuildingCommand } from './commands/delete-building.command';
import { GetBuildingQuery } from './queries/get-building.query';
import { GetBuildingRequestQuery } from './queries/get-buildings.request-query';
import { GetBuildingQueryResponse } from './response/get-buildings.reponse';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('buildings')
@ApiBearerAuth()
export class BuildingController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    @ApiOperation({ description: 'Creates a new building' })
    async create(@Body() createBuildingDto: CreateBuildingCommand) {
        return await this.commandBus.execute(
            new CreateBuildingCommand(
                createBuildingDto.name,
            )
        );
    }

    @Get()
    async getBuildings(
        @Query() query: GetBuildingRequestQuery,
    ) {
        return await this.queryBus.execute<GetBuildingsQuery, GetBuildingQueryResponse>(
            new GetBuildingsQuery(query)
        );
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.queryBus.execute(new GetBuildingQuery(id));
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateBuildingDto: UpdateBuildingCommand,
    ) {
        return await this.commandBus.execute(
            new UpdateBuildingCommand(
                id,
                updateBuildingDto.name,
            )
        );
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.commandBus.execute(
            new DeleteBuildingCommand(id)
        );
    }
} 