import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('test')
@Controller('test')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TestController {
  
  @Get('churches')
  @ApiOperation({ summary: 'Test endpoint para iglesias disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de iglesias de prueba' })
  getTestChurches(@Request() req) {
    console.log('🚨🚨🚨 TEST CONTROLLER EJECUTÁNDOSE 🚨🚨🚨');
    console.log('🔍 req.user:', req.user);
    
    const mockChurches = [
      {
        id: 'church-shalom',
        name: 'Iglesia Shalom',
        organization: {
          id: 'org-arkaone',
          name: 'Asociación Cristiana ArkaOne'
        },
        role: 'LEADER',
        isPrimary: true,
        canAccess: true
      },
      {
        id: 'church-fuente',
        name: 'Fuente de Agua Viva',
        organization: {
          id: 'org-arkaone',
          name: 'Asociación Cristiana ArkaOne'
        },
        role: 'LEADER',
        isPrimary: false,
        canAccess: true
      }
    ];
    
    console.log('🔍 Enviando respuesta mock:', mockChurches);
    return mockChurches;
  }
}
