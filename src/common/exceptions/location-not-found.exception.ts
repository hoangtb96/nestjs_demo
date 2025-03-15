import { NotFoundException } from '@nestjs/common';

export class LocationNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Location with ID ${id} not found`);
  }
} 