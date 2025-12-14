import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export function handlePrismaError(error: unknown) {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new BadRequestException('Duplicate record.');
      case 'P2025':
        return new NotFoundException('Record not found.');
      default:
        return new InternalServerErrorException(
          'An unexpected error occurred.',
        );
    }
  }
  return error;
}
