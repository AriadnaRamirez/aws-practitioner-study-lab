import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserExamDto, UpdateUserExamDto } from './dto/user-exam.dto';
import { UserExamsService } from './user-exams.service';

@ApiTags('me-exams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me/exams')
export class UserExamsController {
  constructor(private readonly userExams: UserExamsService) {}

  @Get()
  @ApiOperation({ summary: 'Exámenes AWS programados (fecha ascendente)' })
  @ApiOkResponse({ description: 'UserExam[]' })
  list(@Req() req: { user: User }) {
    return this.userExams.list(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Programar un examen del catálogo' })
  @ApiCreatedResponse({ description: 'UserExam creado' })
  @ApiBadRequestResponse({ description: 'examCode desconocido o fecha inválida' })
  @ApiConflictResponse({ description: 'Ese examen ya está programado' })
  create(@Req() req: { user: User }, @Body() dto: CreateUserExamDto) {
    return this.userExams.create(req.user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cambiar la fecha de un examen propio' })
  @ApiOkResponse({ description: 'UserExam actualizado' })
  @ApiNotFoundResponse({ description: 'Examen no encontrado' })
  update(
    @Req() req: { user: User },
    @Param('id') id: string,
    @Body() dto: UpdateUserExamDto,
  ) {
    return this.userExams.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un examen propio' })
  @ApiOkResponse({ description: '{ id, deleted: true }' })
  @ApiNotFoundResponse({ description: 'Examen no encontrado' })
  remove(@Req() req: { user: User }, @Param('id') id: string) {
    return this.userExams.remove(req.user.id, id);
  }
}
