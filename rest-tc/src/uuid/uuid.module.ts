// src/uuid/uuid.module.ts
import { Module } from '@nestjs/common';
import { UuidService } from './uuid.service.js';
import { UuidController } from './uuid.controller.js';

@Module({
  providers: [UuidService],
  controllers: [UuidController],
})
export class UuidModule {}
