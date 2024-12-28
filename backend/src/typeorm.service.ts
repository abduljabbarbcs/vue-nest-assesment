import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DatabaseError } from 'pg-protocol';
import { DataSourceOptions, QueryFailedError } from 'typeorm';


export const isQueryFailedError = (err: unknown): err is QueryFailedError & DatabaseError =>
  err instanceof QueryFailedError;
require('dotenv').config();
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    
  private readonly options: DataSourceOptions = {
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    database: process.env.TYPEORM_DATABASE,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    schema: process.env.TYPEORM_SCHEMA,

    entities: [process.env.TYPEORM_ENTITIES],

    logger: 'advanced-console',
    logging: 'all',

    migrations: ["migrations/*.ts"],
    migrationsTableName: process.env.TYPEORM_MIGRATIONS_TABLE_NAME,
    migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true' ? true : false,

    maxQueryExecutionTime: Number(process.env.TYPEORM_MAX_QUERY_EXECUTION_TIME),
    synchronize: true,
  };

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...this.options,
      autoLoadEntities: true,
    };
  }
}
