import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from './auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
    private jwtService: JwtService,
  ) {}

  async signUp(username: string, password: string): Promise<AuthEntity> {
    const salt = await bcrypt.genSalt();
    const user = new AuthEntity();
    user.salt = salt;
    user.username = username;
    const hashedPassword = this.hashPassword(password, user.salt);
    user.password = await hashedPassword;
    try {
      return await this.authRepository.save(user);
    } catch (error) {
      console.log('Error', error);
      if (error.code === '23505') {
        //duplicate username
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const userName = await this.validateUserPassword(username, password);
    if (!userName) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    const payload: JwtPayload = { username: userName };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private async validateUserPassword(username: string, password: string) {
    const user = await this.authRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User ${user} not found`);
    }
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }
}
