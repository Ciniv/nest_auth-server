import {
    CanActivate,
    ExecutionContext,
} from '@nestjs/common';

export class authGuard implements CanActivate {
    canActivate(context: ExecutionContext){
        const req = context.switchToHttp().getRequest();
        return req.session.userId;
    }
}