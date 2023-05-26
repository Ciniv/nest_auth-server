import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private userRepo: Repository<User>
    ){}

    async saveUser(email: string, password: string) {
        const user = this.userRepo.create({email, password})
        return this.userRepo.save(user);
    }

    async findUserById(id: number){
        return await this.userRepo.findOneBy({id: id});
    }
}
