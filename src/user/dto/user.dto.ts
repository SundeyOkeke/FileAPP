import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, MinLength, IsBoolean, IsEnum, IsOptional } from "class-validator";
import { FileStatus } from "../schema/file.schema";

export enum Roles {
  Receptionist = 'Receptionist',
  Officer = 'Officer',
}

export enum Status {
  Pending = 'Pending',
  AcceptedIn = 'AcceptedIn',
  Declined = 'Declined',
  SignedOut = "SignedOut"
}

export class RegisterDto {
  @ApiProperty({ required: true, example: "a.samuel@gmail.com" })
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ required: true, example: "Samuel" })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ required: true, example: "Adeboye" })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ required: true, example: "123456" })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ required: true, example: "CEO"  })
  @IsString()
  @IsNotEmpty()
  readonly role: string;

}

export class LoginDto {
  @ApiProperty({ required: true, example: "a.samuel@gmail.com" })
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ required: true, example: "123456" })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class ReceiveFileDto {
  @ApiProperty({ required: true, example: "Project Quotation" })
  @IsString()
  @IsNotEmpty()
  readonly fileName: string;

  @ApiProperty({ required: true, example: "Green Lunar" })
  @IsString()
  @IsNotEmpty()
  readonly companyName: string;

  @ApiProperty({ required: true, example: "Reviewed" })
  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @ApiProperty({ required: true, example: "24r4423-2322" })
  @IsString()
  @IsNotEmpty()
  readonly assignToID: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  fileData: Array<Express.Multer.File>;
}

export class ReviewFileDto {
  @ApiProperty({ required: true, example: "24r4423-2322" })
  @IsString()
  readonly fileId: string;

  @ApiProperty({ required: true, example: "Reviewed" })
  @IsString()
  @IsOptional()
  readonly comment: string;

  @ApiProperty({ required: true, example: "24r4423-2322" })
  @IsString()
  @IsOptional()
  readonly assignToID: string;

  @ApiProperty({ required: true, example: FileStatus.Completed })
  @IsEnum(FileStatus)
  @IsOptional()
  readonly status: FileStatus;
}

export class ViewSingleFileDto {
  @ApiProperty({ required: true, example: "24r4423-2322" })
  @IsString()
  @IsNotEmpty()
  readonly fileId: string;

}

