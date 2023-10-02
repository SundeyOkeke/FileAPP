import { ConflictException, Injectable, NotAcceptableException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schema/user.schema";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import {  LoginDto, ReceiveFileDto, RegisterDto, ReviewFileDto, ViewSingleFileDto } from "./dto/user.dto";
import { Hash } from "src/utils/utils";

import { File } from "./schema/file.schema";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    private jwtService: JwtService,

    @InjectModel("File") private FileModel: Model<File>,
  
  ) {}

  async register(data: RegisterDto) {
    try{
      const { email, firstName, lastName, password , role} = data

      const user = await this.userModel.findOne({email : email})
      if(user) {
        throw new UnauthorizedException("User already exist")
      }

    const createUser = await this.userModel.create({
      email : email,
      firstName : firstName,
      lastName : lastName,
      password: Hash.make(password),
      role : role
    });

    return createUser;
    } catch(e) {
      throw new UnauthorizedException(e)
    }
  }

  async login(data: LoginDto) {
    const { email, password } = data;

    const user = await this.userModel
      .findOne({ email })

    if (!user) {
      throw new UnauthorizedException("Invalid Credentials");
    }
    const confirmPassword = Hash.compare(password, user.password);

    if (!confirmPassword) {
      throw new UnauthorizedException("Invalid Credentials");
    }

    const payload = {
      id: user._id,
    };
    const token = this.jwtService.sign(payload);

    return { token, user };
  }

  async allUsers() {
    return await this.userModel.find()
  }


  async receiveFile(id, data: ReceiveFileDto, files: ReceiveFileDto) {
    const { fileName, companyName, comment, assignToID } = data
    const user = await this.userModel
      .findById(id )

      const assignedTo = await this.userModel
      .findById(assignToID )

      if(!user){
        throw new UnauthorizedException("Unauthorised")
      }

     await this.FileModel.create({
      fileName : fileName,
      companyName : companyName,
      fileData : files.fileData[0].buffer,
      pendingOn :assignedTo,
      comments: [{ text: comment, postedBy: user }],
      
      
    })
    return { message : "Successful"}
  }

  async reviewFile(id, data: ReviewFileDto) {
    const { comment, assignToID, status, fileId } = data;
  
    const user = await this.userModel.findById(id);
    const assignedTo = await this.userModel.findById(assignToID);
    const file = await this.FileModel.findById(fileId);
  
    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }
  
    const newComment = {
      text: comment,
      postedBy: user, 
    };
  
    file.comments.push(newComment);
  
    if (status) {
      file.status = status;
    }
  
    if (assignedTo) {
      file.pendingOn = assignedTo;
    }
  
    // Save the updated file document
    await file.save();
  
    return { message: "Successful" };
  }

  async allFiles(id: string) {
    const user = await this.userModel.findById(id);
    const files = await this.FileModel.aggregate([
      {
        $match: { pendingOn: user._id }
      },
      {
        $addFields: {
          createdAtDate: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        }
      },
      {
        $group: {
          _id: "$createdAtDate",
          files: { $push: "$$ROOT" }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    console.log(id)
    console.log(files)
  
    return files;
  }

  async singleFile(data: ViewSingleFileDto) {
    const { fileId } = data;
    const responseData = {
      file : null,
      fileImage : ""
    }
    responseData.file = await this.FileModel.findById(fileId).populate("comments.postedBy");
  
    if (responseData.file) {
      const base64Data = Buffer.from(responseData.file.fileData).toString("base64");
      responseData.fileImage = `data:image/jpeg;base64,${base64Data}`;
    }
  
    return responseData;
  }

  


  async decodeToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}


