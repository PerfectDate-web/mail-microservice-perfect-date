import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Notification } from "./schemas/notification.schema";
import { Model } from "mongoose";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@Injectable()
export class NotificationRepository {
    constructor(
        @InjectModel(Notification.name) private readonly notificationModel: Model<Notification>
    ) { }

    async createNotification(dto: CreateNotificationDto) {
        const newNotification = this.notificationModel.create({
            userId: dto.userId,
            type: dto.type,
            options: dto.options,
            scheduledAt: dto.scheduledAt
        });

        return newNotification;
    }

    async getNotificationById(id: string) {
        return await this.notificationModel.findById(id)
            .populate('userId', 'user_email user_name -_id')
            .populate('planId', 'title startDate -_id')
            .lean();
    }

    async addUserIdToNotification(planId: string, userId: string) {
        return await this.notificationModel.updateOne(
            { planId },
            { $addToSet: { userId } } // Chỉ thêm nếu chưa có
        );;
    }

}