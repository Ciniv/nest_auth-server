import { Test } from "@nestjs/testing";
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import {
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';

describe('AuthService', ()=>{
    let service: AuthService;
    let fakeUserService: Partial<UserService>;
    let users: User[] = [];
    
    beforeEach(async () => {
        users = []
        fakeUserService = {
            findUserByEmail: async (email: string) => {
                const user_list = users.filter((user) => user.email === email)
                if(user_list.length){
                    return Promise.resolve(user_list[0])
                }
                return Promise.resolve(null)
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 999999),
                    email: email,
                    password: password,
                } as User;
                users.push(user);
                return Promise.resolve(user)
            }
        }

        const module = await Test.createTestingModule({
            providers:[
                AuthService,
                {
                    provide: UserService,
                    useValue: fakeUserService,
                }
            ],
        }).compile()
    
        service = module.get(AuthService);
    })


    it('service is defined',async ()=>{
        expect(service).toBeDefined();
    })


    it('creates a new user', async () =>{
        const user = await service.signup('test@test.com', 'password');

        expect(user.password).not.toEqual('12345');
        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })


    it('throws an error if email already in use', async () => {
        const user = await service.signup('test@test.com', 'password')

        await expect(
            service.signup('test@test.com', 'password'),
          ).rejects.toThrow(BadRequestException);
    })


    it('throws if signin has unused email', async () =>{
        await expect(
            service.signin('test@test.com', 'password'),
          ).rejects.toThrow(NotFoundException);
    })

    it('throws if an invalid password is provided', async () => {
        await service.signup('test@test.com', 'password')

        await expect(
          service.signin('test@test.com', 'wrong_password'),
        ).rejects.toThrow(BadRequestException);
      });
})

