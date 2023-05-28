import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Session,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Interceptor } from '../interceptors/custom.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/user.decorator';
import { User } from './user.entity';
import { authGuard } from '../guards/auth.guard';

@Controller('auth')
@Interceptor(UserDto)
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ){}

    @Get('/whoami')
    @UseGuards(authGuard)
    whoAmI(@CurrentUser() user: User){
        return user;
    }


    @Post('/signup')
    async signUp (@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id
        return user;
    }

    @Post('/signin')
    async signIn (@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id
        return user;
    }

    @Post('/signout')
    async signOut (@Session() session: any) {
        session.userId = null;
    }

    @Get('/:id')
    async findUserById (@Param('id') id: string) {
        const user = await this.userService.findUserById(parseInt(id));
        if(!user){
            throw new NotFoundException();
        }
        return user;
    }

    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return await this.userService.updateUser(parseInt(id), body);
    }

    @Delete('/:id')
    async removeUser(@Param('id') id: string) {
        return await this.userService.removeUser(parseInt(id));
    }
}
