import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationRepository } from './notifications.repo';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { delay } from 'rxjs';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly notificationRepository: NotificationRepository,
        @InjectQueue('notification-queue') private notificationQueue: Queue,
    ) { }

    async createNotification(createNotificationDto: CreateNotificationDto) {
        return await this.notificationRepository.createNotification(createNotificationDto);
    }

    async scheduleNotification(createNotificationDto: CreateNotificationDto) {

        // Kiểm tra nếu scheduledAt nhỏ hơn hiện tại thì đặt lại thời gian hợp lý
        const scheduledDate = new Date(createNotificationDto.scheduledAt);
        scheduledDate.setHours(20, 0, 0, 0);
        const scheduledTime = scheduledDate.getTime();
        const currentTime = Date.now();
        const timeDelay = scheduledTime - currentTime;

        if (timeDelay <= 0) {
            console.error('⚠️ scheduledAt phải lớn hơn thời gian hiện tại!');
            throw new Error('scheduledAt phải là một thời gian trong tương lai.');
        }

        // Lưu vào database
        const newNotification = await this.notificationRepository.createNotification({
            userId: createNotificationDto.userId,
            type: createNotificationDto.type,
            scheduledAt: createNotificationDto.scheduledAt,
            options: createNotificationDto.options,
        });

        // Thêm vào queue để gửi đúng thời gian
        await this.notificationQueue.add(newNotification, {
            delay: timeDelay, // Thời gian chờ trước khi gửi
            attempts: 3, // Nếu lỗi thì thử lại tối đa 3 lần
        });
    }

    async addUserIdToNotification(planId: string, userId: string) {
        return this.notificationRepository.addUserIdToNotification(planId, userId);
    }
}
