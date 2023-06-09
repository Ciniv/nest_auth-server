import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private userRepo: Repository<User>
    ){}

    async create(email: string, password: string) {
        const user = this.userRepo.create({email, password})
        return this.userRepo.save(user);
    }

    async findUserByEmail(email: string) {
        return await this.userRepo.findOne({where:{email:email}});
    }

    async findUserById(id: number){
        if(!id){
            return null;
        }
        return await this.userRepo.findOneBy({id: id});
    }

    async updateUser(id: number, attrs: Partial<User>) {
        const user = await this.findUserById(id);
        if (!user) {
            throw new NotFoundException();
        }
        Object.assign(user, attrs);
        return this.userRepo.save(user);
    }

    async removeUser(id: number){
        const user = await this.findUserById(id);
        if(!user){
            throw new NotFoundException();
        }
        return await this.userRepo.remove(user);
    }
    
}
