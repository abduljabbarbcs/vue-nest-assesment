import { DataSource, DataSourceOptions } from 'typeorm';

import { TypeOrmConfigService } from './typeorm.service';

const typeormConfigurationService = new TypeOrmConfigService();

const dataSourceConfiguration = typeormConfigurationService.createTypeOrmOptions();
// dataSourceConfiguration.migrations = ['src/migrations/*.ts'];

export const connectionSource = new DataSource(dataSourceConfiguration as DataSourceOptions);
