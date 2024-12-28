import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {RedisService} from '../redis/redis.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth =  request.headers['authorization'];
    if (!auth) {
      throw new UnauthorizedException('No token provided');
    }
    const token = auth.split(' ')[1];
    
    if (await this.redisService.checkTokenBlackList(token)){
      throw new UnauthorizedException('token expired');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload; 
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
