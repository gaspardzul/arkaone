import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('🔍 Debug JWT Guard - canActivate called');
    const request = context.switchToHttp().getRequest();
    console.log('🔍 Debug JWT Guard - Authorization header:', request.headers.authorization);
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('🔍 Debug JWT Guard - handleRequest called');
    console.log('🔍 Debug JWT Guard - err:', err);
    console.log('🔍 Debug JWT Guard - user:', user);
    console.log('🔍 Debug JWT Guard - info:', info);
    
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
