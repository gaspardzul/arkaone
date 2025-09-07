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
import { OfferingsService } from './offerings.service';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { UpdateOfferingDto } from './dto/update-offering.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('offerings')
@Controller('offerings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OfferingsController {
  constructor(private readonly offeringsService: OfferingsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nueva ofrenda' })
  @ApiResponse({ status: 201, description: 'Ofrenda registrada exitosamente' })
  create(@Body() createOfferingDto: CreateOfferingDto, @Request() req) {
    return this.offeringsService.create({
      ...createOfferingDto,
      churchId: req.user.churchId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ofrendas' })
  @ApiResponse({ status: 200, description: 'Lista de ofrendas' })
  findAll(@Request() req) {
    return this.offeringsService.findAll(req.user.churchId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de ofrendas' })
  @ApiResponse({ status: 200, description: 'Estadísticas de ofrendas' })
  getStats(@Request() req) {
    return this.offeringsService.getStats(req.user.churchId);
  }

  @Get('monthly-report')
  @ApiOperation({ summary: 'Obtener reporte mensual de ofrendas' })
  @ApiResponse({ status: 200, description: 'Reporte mensual de ofrendas' })
  getMonthlyReport(@Request() req, @Query('year') year?: string) {
    const reportYear = year ? parseInt(year) : new Date().getFullYear();
    return this.offeringsService.getMonthlyReport(req.user.churchId, reportYear);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ofrenda por ID' })
  @ApiResponse({ status: 200, description: 'Ofrenda encontrada' })
  @ApiResponse({ status: 404, description: 'Ofrenda no encontrada' })
  findOne(@Param('id') id: string) {
    return this.offeringsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar ofrenda' })
  @ApiResponse({ status: 200, description: 'Ofrenda actualizada' })
  @ApiResponse({ status: 404, description: 'Ofrenda no encontrada' })
  update(@Param('id') id: string, @Body() updateOfferingDto: UpdateOfferingDto) {
    return this.offeringsService.update(id, updateOfferingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar ofrenda' })
  @ApiResponse({ status: 200, description: 'Ofrenda eliminada' })
  @ApiResponse({ status: 404, description: 'Ofrenda no encontrada' })
  remove(@Param('id') id: string) {
    return this.offeringsService.remove(id);
  }
}
