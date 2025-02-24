import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { NotificationRepository } from './notifications.repo';
import { BullModule } from '@nestjs/bull';
import { NotificationProcessor } from './notification.processor';
import { MailModule } from 'src/mail/mail.module';
import { User, UserSchema } from 'src/users/schemas/users.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
        collection: 'users' 
      },
    ]),
    BullModule.registerQueueAsync({
      name: 'notification-queue',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: parseInt(`${configService.get('REDIS_PORT')}`, 10), // Chuyển về số
          username: configService.get('REDIS_USERNAME'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRepository, NotificationProcessor],
})
export class NotificationsModule { }
