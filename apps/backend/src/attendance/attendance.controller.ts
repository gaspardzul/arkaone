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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar asistencia' })
  @ApiResponse({ status: 201, description: 'Asistencia registrada exitosamente' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las asistencias' })
  @ApiResponse({ status: 200, description: 'Lista de asistencias' })
  findAll(@Request() req) {
    return this.attendanceService.findAll(req.user.churchId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de asistencia' })
  @ApiResponse({ status: 200, description: 'Estadísticas de asistencia' })
  getStats(@Request() req) {
    return this.attendanceService.getAttendanceStats(req.user.churchId);
  }

  @Get('by-meeting/:meetingId')
  @ApiOperation({ summary: 'Obtener asistencias por reunión' })
  @ApiResponse({ status: 200, description: 'Asistencias de la reunión' })
  findByMeeting(@Param('meetingId') meetingId: string) {
    return this.attendanceService.findByMeeting(meetingId);
  }

  @Get('by-member/:memberId')
  @ApiOperation({ summary: 'Obtener asistencias por miembro' })
  @ApiResponse({ status: 200, description: 'Asistencias del miembro' })
  findByMember(@Param('memberId') memberId: string) {
    return this.attendanceService.findByMember(memberId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener asistencia por ID' })
  @ApiResponse({ status: 200, description: 'Asistencia encontrada' })
  @ApiResponse({ status: 404, description: 'Asistencia no encontrada' })
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar asistencia' })
  @ApiResponse({ status: 200, description: 'Asistencia actualizada' })
  @ApiResponse({ status: 404, description: 'Asistencia no encontrada' })
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar asistencia' })
  @ApiResponse({ status: 200, description: 'Asistencia eliminada' })
  @ApiResponse({ status: 404, description: 'Asistencia no encontrada' })
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }

  @Post('bulk/:meetingId')
  @ApiOperation({ summary: 'Crear asistencias masivas para una reunión' })
  @ApiResponse({ status: 201, description: 'Asistencias creadas exitosamente' })
  bulkCreate(
    @Param('meetingId') meetingId: string,
    @Body() body: { memberIds: string[] }
  ) {
    return this.attendanceService.bulkCreateAttendance(meetingId, body.memberIds);
  }
}
