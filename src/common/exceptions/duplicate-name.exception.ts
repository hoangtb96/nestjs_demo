import { ConflictException } from '@nestjs/common';

export class DuplicateNameException extends ConflictException {
    constructor(entityType: string, name: string) {
        super(`${entityType} with name "${name}" already exists`);
    }
} 