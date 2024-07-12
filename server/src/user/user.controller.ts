import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./dto";

@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  //   @Post("login")
  //   async login(@Body() userDto: UserDto): Promise<{ access_token: string }> {
  //     const { email, password, name } = userDto;
  //     if (!email || !password || !name)
  //       throw new BadRequestException("Invalid email or password");

  //     try {
  //         const { access_token, refresh_token} = await this.appService.login(userDto);
  //         console.log(access_token, refresh_token);
  //     } catch(error) {
  //         throw new BadRequestException(error);
  //     }
  //   }

  @Post("signup")
  async createUser(
    @Body() userDto: UserDto
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { email, password } = userDto;

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!email || !password || password.length < 6 || !isValidEmail) {
      throw new BadRequestException("Invalid email or password");
    }

    // const user = await this.appService.findUser(email);
    // if (user) throw new BadRequestException("User already exists");

    const { access_token, refresh_token } =
      await this.appService.createUser(userDto);
    console.log(access_token, refresh_token);

    return { access_token: "", refresh_token: "" };
  }

  //   @Get("me")
  //   async findUser(
  //     @Headers("authorization") authorizationHeader: string
  //   ): Promise<{ user: User }> {
  //     if (!authorizationHeader)
  //       throw new BadRequestException("Token is required");

  //     const user = await this.appService.checkToken(
  //       authorizationHeader.replace("Bearer ", "")
  //     );

  //     if (!user) {
  //       throw new BadRequestException("Wrong token");
  //     }

  //     return user;
  //   }
}
