import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { NotificationRepository } from './notifications.repo';

@Processor('notification-queue')
@Injectable()
export class NotificationProcessor {
    constructor(
        private readonly mailService: MailService,
        private notificationRepository: NotificationRepository
    ) { }
    @Process()
    async handleNotification(job: Job) {
        const { userId, message, scheduledAt, options, _id } = job.data;
        console.log(`Sending notification to user ${userId}: ${message} at ${scheduledAt}`);
        try {
            const notification = await this.notificationRepository.getNotificationById(_id) as any;
            console.log('notification', notification);

            console.log('Sending email to: ', notification?.userId.map(user=>user.user_email), {
                planName: options.title || '',
                startDate: options.startDate || '',
                userNames: notification?.userId.map(user=>user.user_name) || [],
            });
            // await this.mailService.sendMail(notification?.userId.map(user=>user.user_email), {
            //     planName: notification?.planId.title || '',
            //     startDate: notification?.planId.startDate || '',
            //     userNames: notification?.userId.map(user=>user.user_name) || [],
            // }, 'notification-template', 'Notification');

        } catch (error) {
            console.error('Failed to save notification: ', error);
        }
    
    }
}
// notification {
//     _id: new ObjectId('67a6d83b6fee5c997e865358'),
//     planId: { title: 'Mtri vs Qnhu' },
//     userId: [
//       {
//         user_email: 'tranminhtri10213@gmail.com',
//         user_name: 'Trần Minh Trí'
//       },
//       { user_email: '2251150039@ut.edu.vn', user_name: 'Trần Minh Trí' }
//     ],
//     message: 'Test',
//     scheduledAt: 2025-02-08T00:00:00.000Z,
//     options: { planId: '123', planName: '123', startDate: '2025-02-09' },
//     createdAt: 2025-02-08T04:06:19.320Z,
//     updatedAt: 2025-02-08T04:06:19.320Z,
//     __v: 0
//   }
