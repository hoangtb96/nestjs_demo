import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class CommandValidationError extends BadRequestException {
  constructor(errors: string[]) {
    super({
      statusCode: 400,
      message: 'Validation failed',
      errors,
    });
  }
}

export const validateCommand = async <T extends object>(command: T): Promise<void> => {
  const errors = await validate(command as object, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    const messages = errors.map(error => 
      Object.values(error.constraints || {})
    ).flat();
    
    throw new CommandValidationError(messages);
  }
}; 