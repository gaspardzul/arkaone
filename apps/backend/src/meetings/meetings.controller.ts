import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('meetings')
@Controller('meetings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva reunión' })
  @ApiResponse({ status: 201, description: 'Reunión creada exitosamente' })
  create(@Body() createMeetingDto: CreateMeetingDto, @Request() req) {
    return this.meetingsService.create({
      ...createMeetingDto,
      churchId: req.user.churchId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reuniones' })
  @ApiResponse({ status: 200, description: 'Lista de reuniones' })
  findAll(@Request() req) {
    return this.meetingsService.findAll(req.user.churchId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de reuniones' })
  @ApiResponse({ status: 200, description: 'Estadísticas de reuniones' })
  getStats(@Request() req) {
    return this.meetingsService.getStats(req.user.churchId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener reunión por ID' })
  @ApiResponse({ status: 200, description: 'Reunión encontrada' })
  @ApiResponse({ status: 404, description: 'Reunión no encontrada' })
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar reunión' })
  @ApiResponse({ status: 200, description: 'Reunión actualizada' })
  @ApiResponse({ status: 404, description: 'Reunión no encontrada' })
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingsService.update(id, updateMeetingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar reunión' })
  @ApiResponse({ status: 200, description: 'Reunión eliminada' })
  @ApiResponse({ status: 404, description: 'Reunión no encontrada' })
  remove(@Param('id') id: string) {
    return this.meetingsService.remove(id);
  }
}
