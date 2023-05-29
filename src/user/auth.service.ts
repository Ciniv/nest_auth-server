import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService{

    constructor(
        private readonly userService: UserService
    ){}

    async signup(email: string, password: string) {

        const user = await this.userService.findUserByEmail(email);
        if(user){
            throw new BadRequestException();
        }
        //gera o salt
        const salt = randomBytes(8).toString('hex');
        //hash o salt e a senha juntos
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        const result = salt + '.' + hash.toString('hex');

        return await this.userService.create(email,result);
    }


    async signin(email: string, password: string) {
        const user = await this.userService.findUserByEmail(email);
        if(!user){
            throw new NotFoundException();
        }
        const [salt, savedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if(hash.toString('hex') !== savedHash){
            throw new BadRequestException();
        }
        return user;
    }

}