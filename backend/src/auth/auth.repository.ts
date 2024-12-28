import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Auth } from './entities/auth.entity';
import { Login, CreateUserOptions } from './types';

@Injectable()
export class AuthRepository extends Repository<Auth> {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(private readonly dataSource: DataSource) {
    super(Auth, dataSource.createEntityManager());
  }

  async insertOne(signup: CreateUserOptions): Promise<Auth> {
    try {
      return await this.save(signup);
    } catch (error) {
      throw new Error('Db Error: ' + error.message);
    }
  }

  async getOne(login: Login): Promise<Auth> {
    try {
      const email = login.email;
      return await this.findOne({ where: { email },   relations: ['role'], });
    } catch (error) {
      this.logger.error(error);

      throw new Error('Db Error: ' + error.message);
    }
  }
}
