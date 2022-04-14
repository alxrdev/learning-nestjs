import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  create(name: string, email: string, password: string) {
    const user = this.repository.create({
      name,
      email,
      password,
    });

    return this.repository.save(user);
  }

  findOne(id: number) {
    if (!id) return null;
    return this.repository.findOne(id);
  }

  find(email: string) {
    return this.repository.find({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('user not found');

    Object.assign(user, attrs);

    return this.repository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('user not found');

    return this.repository.remove(user);
  }
}
