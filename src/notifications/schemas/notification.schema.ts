import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { NotificationType } from "src/enums/notification-type";

@Schema({
    timestamps: true,
})
export class Notification {

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        required: true,
    })
    userId: Types.ObjectId[];

    @Prop({
        required: true,
        enum: NotificationType,
    })
    type: string;

    @Prop(
        {
            required: true,
        }
    )
    scheduledAt: Date;

    @Prop({
        type: Object,
        default: {},
    })
    options: { [key: string]: string | number };
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);