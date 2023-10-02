import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { ValueTransformer } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./user.schema";

export enum FileStatus {
  InProgress = "In-progress",
  Completed = "Completed",
}

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({ type: Buffer }) 
  fileData: Buffer;

  @Prop({
    required: true,
    enum: FileStatus, 
    default: FileStatus.InProgress,
  })
  status: string;

  @Prop([
    {
      text: String,
      postedBy: { type: SchemaTypes.ObjectId, ref: "User" },
    },
  ])
  comments: { text: string; postedBy: User }[];

  @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
  pendingOn: User;

}

export type FileDocument = File & Document;

export const FileSchema = SchemaFactory.createForClass(File);
