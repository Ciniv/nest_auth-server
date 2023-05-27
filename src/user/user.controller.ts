import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Interceptor } from '../interceptors/custom.interceptor';

@Controller('auth')
@Interceptor(UserDto)
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}

    @Post('/signup')
    async saveUser (@Body() body: CreateUserDto) {
        return await this.userService.saveUser(body.email, body.password);
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
