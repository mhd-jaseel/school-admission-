import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../common/enums/role.enum';

export type UserDocument = User & Document;

// Represents a user account in the system database.
// Supports both 'parent' and 'admission_team' roles.
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, required: true, enum: Role, default: Role.PARENT })
  role: Role;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  phone?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
