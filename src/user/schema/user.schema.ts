import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { ValueTransformer } from "typeorm";
import * as bcrypt from "bcrypt";


@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
