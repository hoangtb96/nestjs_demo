import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateLocationCommand } from './commands/create-location.command';
import { UpdateLocationCommand } from './commands/update-location.command';
import { DeleteLocationCommand } from './commands/delete-location.command';
import { GetLocationQuery } from './queries/get-location.query';
import { GetLocationsQuery } from './queries/get-locations.query';
import { GetLocationTreeQuery } from './queries/get-location-tree.query';
import { Location } from '../../entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationService } from './location.service';
import { BuildingNotFoundException } from '../../common/exceptions/building-not-found.exception';
import { LocationNotFoundException } from '../../common/exceptions/location-not-found.exception';
import { DuplicateNameException } from '../../common/exceptions/duplicate-name.exception';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly locationService: LocationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, description: 'Location successfully created', type: Location })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createLocation(@Body() createLocationDto: CreateLocationDto) {
    try {
      const { name, locationNumber, area, buildingId, buildingName, parentId } = createLocationDto;
      return await this.commandBus.execute(
        new CreateLocationCommand(name, locationNumber, area, buildingId, buildingName, parentId)
      );
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({ status: 200, description: 'List of all locations', type: [Location] })
  async getLocations() {
    try {
      return await this.queryBus.execute(new GetLocationsQuery());
    } catch (error) {
      throw error;
    }
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get location tree structure' })
  @ApiResponse({ status: 200, description: 'Location tree structure', type: [Location] })
  async getLocationTree() {
    try {
      return await this.queryBus.execute(new GetLocationTreeQuery());
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a location by ID' })
  @ApiParam({ name: 'id', description: 'Location ID' })
  @ApiResponse({ status: 200, description: 'Location found', type: Location })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async getLocation(@Param('id') id: string) {
    try {
      const location = await this.queryBus.execute(new GetLocationQuery(id));
      if (!location) {
        throw new LocationNotFoundException(id);
      }
      return location;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Get children of a location' })
  @ApiParam({ name: 'id', description: 'Location ID' })
  @ApiResponse({ status: 200, description: 'Return the children locations.', type: [Location] })
  @ApiResponse({ status: 404, description: 'Location not found.' })
  async getChildren(@Param('id') id: string): Promise<Location[]> {
    try {
      const children = await this.locationService.getChildren(id);
      if (!children) {
        throw new LocationNotFoundException(id);
      }
      return children;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id/parents')
  @ApiOperation({ summary: 'Get parents of a location' })
  @ApiParam({ name: 'id', description: 'Location ID' })
  @ApiResponse({ status: 200, description: 'Return the parent locations.', type: [Location] })
  @ApiResponse({ status: 404, description: 'Location not found.' })
  async getParents(@Param('id') id: string): Promise<Location[]> {
    try {
      const parents = await this.locationService.getParents(id);
      if (!parents) {
        throw new LocationNotFoundException(id);
      }
      return parents;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a location' })
  @ApiParam({ name: 'id', description: 'Location ID' })
  @ApiResponse({ status: 200, description: 'Location updated successfully', type: Location })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async updateLocation(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto
  ) {
    try {
      const { name, locationNumber, area, buildingId, buildingName, parentId } = updateLocationDto;
      const location = await this.commandBus.execute(
        new UpdateLocationCommand(id, name, locationNumber, area, buildingId, buildingName, parentId)
      );
      if (!location) {
        throw new LocationNotFoundException(id);
      }
      return location;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a location' })
  @ApiParam({ name: 'id', description: 'Location ID' })
  @ApiResponse({ status: 200, description: 'Location deleted successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async deleteLocation(@Param('id') id: string) {
    try {
      const result = await this.commandBus.execute(new DeleteLocationCommand(id));
      if (!result) {
        throw new LocationNotFoundException(id);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
} 