import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        const dbConfig = {
          dialect: 'postgres' as Dialect,
          host: configService.get('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          autoLoadModels: true,
          synchronize: !isProduction,
          logging: console.log,

          dialectOptions:
            isProduction == false
              ? {
                  ssl: {
                    require: true,
                    rejectUnauthorized: false, // use true if your certificate is trusted (not self-signed)
                  },
                }
              : {},
        };

        return dbConfig;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
