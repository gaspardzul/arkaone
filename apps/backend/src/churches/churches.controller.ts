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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChurchesService } from './churches.service';
import { CreateChurchDto } from './dto/create-church.dto';
import { UpdateChurchDto } from './dto/update-church.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('churches')
@Controller('churches')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChurchesController {
  constructor(private readonly churchesService: ChurchesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva iglesia' })
  @ApiResponse({ status: 201, description: 'Iglesia creada exitosamente' })
  create(@Body() createChurchDto: CreateChurchDto) {
    return this.churchesService.create(createChurchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las iglesias' })
  @ApiResponse({ status: 200, description: 'Lista de iglesias' })
  findAll() {
    return this.churchesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener iglesia por ID' })
  @ApiResponse({ status: 200, description: 'Iglesia encontrada' })
  @ApiResponse({ status: 404, description: 'Iglesia no encontrada' })
  findOne(@Param('id') id: string) {
    return this.churchesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar iglesia' })
  @ApiResponse({ status: 200, description: 'Iglesia actualizada' })
  @ApiResponse({ status: 404, description: 'Iglesia no encontrada' })
  update(@Param('id') id: string, @Body() updateChurchDto: UpdateChurchDto) {
    return this.churchesService.update(id, updateChurchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar iglesia' })
  @ApiResponse({ status: 200, description: 'Iglesia eliminada' })
  @ApiResponse({ status: 404, description: 'Iglesia no encontrada' })
  remove(@Param('id') id: string) {
    return this.churchesService.remove(id);
  }
}
