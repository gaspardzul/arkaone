import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ChurchContextGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Obtener el churchId del header, query param o body
    const churchId = 
      request.headers['x-church-id'] || 
      request.query.churchId || 
      request.body?.churchId;

    if (!churchId) {
      throw new BadRequestException(
        'Debes seleccionar una iglesia para acceder a este recurso. Usa el header "x-church-id" o el parámetro "churchId"'
      );
    }

    // Validar que el usuario tenga acceso a esta iglesia
    try {
      const hasAccess = await this.usersService.validateChurchAccess(user.sub, churchId);
      
      if (!hasAccess) {
        throw new ForbiddenException('No tienes acceso a esta iglesia');
      }

      // Agregar el churchId al request para uso posterior
      request.selectedChurchId = churchId;
      
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      throw new ForbiddenException('Error validando acceso a la iglesia');
    }
  }
}
