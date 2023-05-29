import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({id:1, email, password} as User)
      },
      // signin: () => {}
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers:[
        {
          provide: AuthService,
          useValue:fakeAuthService,
        },
        {
          provide: UserService,
          useValue:fakeUserService,
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('test signup and session', async ()=> {
    let session = {userId: -1}
    const user = await controller.signUp({email: 'test@test.com', password: 'password'}, session)

    expect(session.userId).toBe(1)
    expect(user.id).toBe(1)
  })
});
