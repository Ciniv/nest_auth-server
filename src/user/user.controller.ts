import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Interceptor } from '../interceptors/custom.interceptor';
import { AuthService } from './auth.service';

@Controller('auth')
@Interceptor(UserDto)
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ){}

    @Post('/signup')
    async signup (@Body() body: CreateUserDto) {
        return await this.authService.signup(body.email, body.password);
    }

    @Post('/signin')
    async signin (@Body() body: CreateUserDto) {
        return await this.authService.signin(body.email, body.password);
    }

    @Post('/signout')
    async signout (@Body() body: CreateUserDto) {
        return await this.authService.signout(body.email, body.password);
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
