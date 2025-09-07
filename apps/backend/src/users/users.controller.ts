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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SelectChurchDto } from './dto/select-church.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChurchContextGuard } from '../auth/guards/church-context.guard';
import { SelectedChurch } from '../auth/decorators/selected-church.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(ChurchContextGuard)
  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiHeader({
    name: 'x-church-id',
    description: 'ID de la iglesia seleccionada',
    required: true,
  })
  create(@Body() createUserDto: CreateUserDto, @SelectedChurch() churchId: string) {
    return this.usersService.create({
      ...createUserDto,
      churchId,
    });
  }

  @Get()
  @UseGuards(ChurchContextGuard)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiHeader({
    name: 'x-church-id',
    description: 'ID de la iglesia seleccionada',
    required: true,
  })
  findAll(@SelectedChurch() churchId: string) {
    return this.usersService.findAll(churchId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('available-churches')
  @ApiOperation({ summary: 'Obtener iglesias disponibles para el usuario actual' })
  @ApiResponse({ status: 200, description: 'Lista de iglesias disponibles' })
  async getAvailableChurches(@Request() req) {
    console.log('🚨🚨🚨 CONTROLADOR EJECUTÁNDOSE - AVAILABLE CHURCHES 🚨🚨🚨');
    
    try {
      const result = await this.usersService.getAvailableChurches(req.user.userId);
      console.log('🔍 Debug Controller - Resultado del servicio:', result);
      return result;
    } catch (error) {
      console.log('🔍 Debug Controller - Error capturado:', error);
      throw error;
    }
  }

  @Get('test')
  @ApiOperation({ summary: 'Endpoint de prueba' })
  testEndpoint(@Request() req) {
    console.log('🚨 TEST ENDPOINT EJECUTÁNDOSE 🚨');
    console.log('🔍 req.user:', req.user);
    return { message: 'Test exitoso', user: req.user };
  }

  @Post('select-church')
  @ApiOperation({ summary: 'Seleccionar iglesia para trabajar' })
  @ApiResponse({ status: 200, description: 'Iglesia seleccionada exitosamente' })
  @ApiResponse({ status: 403, description: 'No tienes acceso a esta iglesia' })
  @ApiResponse({ status: 404, description: 'Iglesia no encontrada' })
  selectChurch(@Body() selectChurchDto: SelectChurchDto, @Request() req) {
    return this.usersService.selectChurch(req.user.userId, selectChurchDto);
  }

  @Get('my-churches')
  @ApiOperation({ summary: 'Obtener iglesias del usuario actual' })
  @ApiResponse({ status: 200, description: 'Lista de iglesias del usuario' })
  getMyChurches(@Request() req) {
    return this.usersService.getUserChurches(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
