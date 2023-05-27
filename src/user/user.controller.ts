import { Body, Controller, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}

    @Post()
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
}
