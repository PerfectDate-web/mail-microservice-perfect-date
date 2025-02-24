import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({
    collection: 'users',  // Quan trọng: phải match với collection của perfect_date
    timestamps: true,
})
export class User extends Document {
   
}

export const UserSchema = SchemaFactory.createForClass(User);