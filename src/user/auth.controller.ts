import {
  Body,
  Controller,
  Post,
  Param,
  Put,
  UseGuards,
  Req,
  Get,
  Patch,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {  LoginDto, ReceiveFileDto, RegisterDto, ReviewFileDto, ViewSingleFileDto } from "./dto/user.dto";
import { JwtAuthGuard } from "guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { FileFieldsInterceptor } from "@nestjs/platform-express";


@Controller("user")
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({ status: 200, description: 'Operation Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Session Expired' })
  @Post("/register")
  async register(@Body() data: RegisterDto) {
    return await this.authService.register(data);
  }

  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, description: 'Operation Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Session Expired' })
  @Post("/login")
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @ApiOperation({ summary: 'Receive File' })
  @ApiResponse({ status: 200, description: 'Operation Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Session Expired' })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'fileData', maxCount: 1 }]))
  @ApiBearerAuth()
  @Post("receive/file")
  @UseGuards(JwtAuthGuard)
  async receiveFile(@Req() req, @Body() data: ReceiveFileDto, @UploadedFiles() files: ReceiveFileDto,) {
    const id: string = req.user.id;
    console.log(files)
    return await this.authService.receiveFile(id, data, files);
  }

  @ApiOperation({ summary: 'Get All Users (to populate assignTo dropdown)' })
  @ApiResponse({ status: 200, description: 'Operation Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Session Expired' })
  @ApiBearerAuth()
  @Get("all/users")
  @UseGuards(JwtAuthGuard)
  async allUsers() {
    return await this.authService.allUsers();
  }

  @ApiOperation({ summary: 'Review File' })
  @ApiResponse({ status: 200, description: 'Operation Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Session Expired' })
  @ApiBearerAuth()
  @Put("review/file")
  @UseGuards(JwtAuthGuard)
  reviewFile(@Req() req, @Body() data: ReviewFileDto) {
    const id: string = req.user.id;
    return this.authService.reviewFile(id, data);
  }

  @ApiOperation({ summary: 'Get all assigned files' })
  @ApiResponse({ status: 200, description: 'Operation Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Session Expired' })
  @ApiBearerAuth()
  @Get("all/files")
  @UseGuards(JwtAuthGuard)
  allFiles(@Req() req,) {
    const id: string = req.user.id;
    return this.authService.allFiles(id);
  }

  @ApiOperation({ summary: 'View a company file' })
  @ApiResponse({ status: 200, description: 'Operation Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Session Expired' })
  @ApiBearerAuth()
  @Put("single/file")
  @UseGuards(JwtAuthGuard)
  singleFile(@Body() data: ViewSingleFileDto) {
    return this.authService.singleFile(data);
  }

 

  
}
