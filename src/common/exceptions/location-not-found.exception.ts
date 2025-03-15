import { NotFoundException } from '@nestjs/common';

export class LocationNotFoundException extends NotFoundException {
  constructor(locationId?: string) {
    super(
      locationId 
        ? `Location with ID "${locationId}" not found` 
        : 'Location not found'
    );
  }
} 