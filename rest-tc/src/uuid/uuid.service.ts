// src/uuid/uuid.service.ts
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class UuidService {
  /**
   * Generate a new UUID v4
   */
  generate(): string {
    return uuidv4();
  }

  /**
   * Validate if a string is a valid UUID
   */
  isValid(uuid: string): boolean {
    return uuidValidate(uuid);
  }
}
