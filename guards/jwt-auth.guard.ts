import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/user/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly userService: AuthService) {
      super();
    }
    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      if(!authHeader){
        throw new UnauthorizedException('Unauthorised or Expired session');
      }
      const token = authHeader.split(' ')[1];
      request.token = token;
      const decoded = await this.userService.decodeToken(token);
      if (decoded) {
        const timeDiff = decoded.exp - decoded.iat;
  
        if (timeDiff <= 0) {
          throw new UnauthorizedException('Expired session');
        }
        return (request.user = decoded);
      } else {
        throw new UnauthorizedException('Unauthorised or Expired session');
      }
    }
  }
