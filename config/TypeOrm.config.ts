import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'PasswordManager',
  username: 'postgres',
  password: '12345',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
