import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva organización' })
  @ApiResponse({ status: 201, description: 'Organización creada exitosamente.' })
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las organizaciones' })
  @ApiResponse({ status: 200, description: 'Lista de organizaciones.' })
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una organización por ID' })
  @ApiResponse({ status: 200, description: 'Organización encontrada.' })
  @ApiResponse({ status: 404, description: 'Organización no encontrada.' })
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de una organización' })
  @ApiResponse({ status: 200, description: 'Estadísticas de la organización.' })
  getStats(@Param('id') id: string) {
    return this.organizationsService.getStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una organización' })
  @ApiResponse({ status: 200, description: 'Organización actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Organización no encontrada.' })
  update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una organización' })
  @ApiResponse({ status: 200, description: 'Organización eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Organización no encontrada.' })
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}
