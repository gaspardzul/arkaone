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
import { MinistriesService } from './ministries.service';
import { CreateMinistryDto } from './dto/create-ministry.dto';
import { UpdateMinistryDto } from './dto/update-ministry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ministries')
@Controller('ministries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MinistriesController {
  constructor(private readonly ministriesService: MinistriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo ministerio' })
  @ApiResponse({ status: 201, description: 'Ministerio creado exitosamente' })
  create(@Body() createMinistryDto: CreateMinistryDto, @Request() req) {
    return this.ministriesService.create({
      ...createMinistryDto,
      churchId: req.user.churchId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los ministerios' })
  @ApiResponse({ status: 200, description: 'Lista de ministerios' })
  findAll(@Request() req) {
    return this.ministriesService.findAll(req.user.churchId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de ministerios' })
  @ApiResponse({ status: 200, description: 'Estadísticas de ministerios' })
  getStats(@Request() req) {
    return this.ministriesService.getStats(req.user.churchId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ministerio por ID' })
  @ApiResponse({ status: 200, description: 'Ministerio encontrado' })
  @ApiResponse({ status: 404, description: 'Ministerio no encontrado' })
  findOne(@Param('id') id: string) {
    return this.ministriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar ministerio' })
  @ApiResponse({ status: 200, description: 'Ministerio actualizado' })
  @ApiResponse({ status: 404, description: 'Ministerio no encontrado' })
  update(@Param('id') id: string, @Body() updateMinistryDto: UpdateMinistryDto) {
    return this.ministriesService.update(id, updateMinistryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar ministerio' })
  @ApiResponse({ status: 200, description: 'Ministerio eliminado' })
  @ApiResponse({ status: 404, description: 'Ministerio no encontrado' })
  remove(@Param('id') id: string) {
    return this.ministriesService.remove(id);
  }

  @Post(':ministryId/members/:memberId')
  @ApiOperation({ summary: 'Agregar miembro al ministerio' })
  @ApiResponse({ status: 201, description: 'Miembro agregado al ministerio' })
  addMember(
    @Param('ministryId') ministryId: string,
    @Param('memberId') memberId: string,
    @Body() body: { role?: string }
  ) {
    return this.ministriesService.addMember(ministryId, memberId, body.role);
  }

  @Delete(':ministryId/members/:memberId')
  @ApiOperation({ summary: 'Remover miembro del ministerio' })
  @ApiResponse({ status: 200, description: 'Miembro removido del ministerio' })
  removeMember(
    @Param('ministryId') ministryId: string,
    @Param('memberId') memberId: string
  ) {
    return this.ministriesService.removeMember(ministryId, memberId);
  }
}
