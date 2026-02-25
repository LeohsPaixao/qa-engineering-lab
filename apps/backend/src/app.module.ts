import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { HealthyModule } from './modules/healthy/healthy.module';
import { PasswordRecoveryModule } from './modules/password-recovery/password-recovery.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    PasswordRecoveryModule,
    HealthyModule,
  ],
  controllers: [],
})
export class AppModule {}
