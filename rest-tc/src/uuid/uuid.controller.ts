// src/uuid/uuid.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { UuidService } from './uuid.service.js';


@Controller('uuid')
export class UuidController {
  constructor(private readonly uuidService: UuidService) {}

  @Get('generate')
  generateUuid(): { uuid: string } {
    return { uuid: this.uuidService.generate() };
  }

  @Get('validate/:id')
  validateUuid(@Param('id') id: string): { valid: boolean } {
    return { valid: this.uuidService.isValid(id) };
  }
}
