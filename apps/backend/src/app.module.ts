import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ContactsModule } from './contacts/contacts.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri =
          configService.get<string>('MONGODB_URI') ??
          'mongodb://localhost:27017/defaultdb';

        // Log the MongoDB URI
        Logger.log(`MongoDB URI: ${uri}`, 'AppModule');

        // Log all available environment variables
        Logger.log('Available environment variables:', 'AppModule');
        Logger.log(
          `MONGODB_URI: ${configService.get<string>('MONGODB_URI')}`,
          'AppModule',
        );
        return { uri };
      },
      inject: [ConfigService],
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Log JWT configuration
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN');

        Logger.log(
          `JWT_SECRET is ${secret ? 'defined' : 'undefined'}`,
          'AppModule',
        );
        Logger.log(`JWT_EXPIRES_IN: ${expiresIn}`, 'AppModule');

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
      inject: [ConfigService],
    }),
    ContactsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
