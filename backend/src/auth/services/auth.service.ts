import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { AuthValidator } from './auth-validator.service';
import { AuthRepository } from '../auth.repository';
import { CreateUserOptions, Login } from '../types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../redis/redis.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly authValidator: AuthValidator,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async create(signup: CreateUserOptions) {
    await this.authValidator.validateOnCreate(signup);
    if (!(await this.authValidator.validatePassword(signup.password))) {
      throw new BadRequestException(
        'Password does not meet the required criteria.',
      );
    }
    const password = signup.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    signup.password = hashedPassword;
    const user = await this.authRepository.insertOne(signup);
    const createdUser = new this.userModel({
      name: user.name,
      email: user.email,
      wallet: [],
      transaction: [],
      incoming: 0,
      expenses: 0,
    });
    await createdUser.save();
    const payload = { email: user.email, userId: user.userId, role: user.role };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  findAll() {
    return `This action returns all auth`;
  }

  async findOne(login: Login) {
    const user = await this.authRepository.getOne(login);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(login.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      name: user.name,
      email: user.email,
      userId: user.userId,
      role: user.role.name,
    };
    const token = this.jwtService.sign(payload);
    return { access_token: token, role: user.role.name, name:user.name };
  }

  async getUserRoles(email: string): Promise<string[]> {
    const user = await this.authRepository.findOne({
      where: { email },
      relations: ['role'],
    });
    return user && user.role ? [user.role.name] : [];
  }

  async logout(@Req() request: Request) {
    const token = request.headers['authorization']?.split(' ')[1];
    const currentTime = Math.floor(Date.now() / 1000);
    this.redisService.blackListToken(
      token,
      request['user']['exp'] - currentTime,
    );
    return { message: 'Logged out successfully' };
  }
}
