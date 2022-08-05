import { createParamDecorator } from '@nestjs/common';
import { AuthEntity } from './auth.entity';

export const GetUser = createParamDecorator((data, ctx): AuthEntity => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
