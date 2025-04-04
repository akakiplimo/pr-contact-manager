import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../auth/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: [String],
    enum: Object.values(Role),
    default: [Role.USER],
  })
  roles: Role[];

  id?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
});
