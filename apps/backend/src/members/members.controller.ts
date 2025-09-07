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
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('members')
@Controller('members')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo miembro' })
  @ApiResponse({ status: 201, description: 'Miembro creado exitosamente' })
  create(@Body() createMemberDto: CreateMemberDto, @Request() req) {
    return this.membersService.create({
      ...createMemberDto,
      churchId: req.user.churchId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los miembros' })
  @ApiResponse({ status: 200, description: 'Lista de miembros' })
  findAll(@Request() req) {
    return this.membersService.findAll(req.user.churchId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de miembros' })
  @ApiResponse({ status: 200, description: 'Estadísticas de miembros' })
  getStats(@Request() req) {
    return this.membersService.getStats(req.user.churchId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener miembro por ID' })
  @ApiResponse({ status: 200, description: 'Miembro encontrado' })
  @ApiResponse({ status: 404, description: 'Miembro no encontrado' })
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar miembro' })
  @ApiResponse({ status: 200, description: 'Miembro actualizado' })
  @ApiResponse({ status: 404, description: 'Miembro no encontrado' })
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar miembro' })
  @ApiResponse({ status: 200, description: 'Miembro eliminado' })
  @ApiResponse({ status: 404, description: 'Miembro no encontrado' })
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
