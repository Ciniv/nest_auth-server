import { Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../user.service';

@Injectable()
export class currentUserInterceptor implements NestInterceptor {

    constructor(
        private readonly userService: UserService
    ){}

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest()
        const { userId } = req.session || {};

        if(userId){
            const user = await this.userService.findUserById(userId);
            req.currentUser = user;
        }

        return next.handle();
    }
    
}