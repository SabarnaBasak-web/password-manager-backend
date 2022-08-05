import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Auth')
export class AuthType {
  @Field((type) => ID)
  id: string;
  @Field()
  username: string;
}
