import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthType } from './type/auth.type';
import { AccessToken } from './access-token.type';
@Resolver((of) => AuthType)
export class AuthResolver {
  constructor(private authService: AuthService) {}
  @Query((returns) => String)
  test() {
    return `hello World`;
  }
  @Mutation((returns) => AuthType)
  signup(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return this.authService.signUp(username, password);
  }

  @Mutation((returns) => AccessToken)
  async signin(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(username, password);
  }
}
