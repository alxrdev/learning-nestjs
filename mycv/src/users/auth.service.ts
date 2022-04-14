import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(name: string, email: string, password: string) {
    const users = await this.usersService.find(email);

    if (users.length) throw new BadRequestException('email in use');

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer; // the 32 means that this give us back 32 characters

    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(name, email, result);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) throw new BadRequestException('email/password invalid');

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('email/password invalid');

    return user;
  }
}
