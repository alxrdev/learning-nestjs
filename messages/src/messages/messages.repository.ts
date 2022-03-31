import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class MessagesRepository {
  async loadMessages() {
    const contents = await readFile('messages.json', 'utf-8');
    const messages = JSON.parse(contents);
    return messages;
  }

  async findOne(id: string) {
    const messages = await this.loadMessages();
    return messages[id];
  }

  async findAll() {
    const messages = await this.loadMessages();
    return messages;
  }

  async create(message: string) {
    const messages = await this.loadMessages();

    const id = Math.floor(Math.random() * 999);

    messages[id] = { id, content: message };

    await writeFile('messages.json', JSON.stringify(messages));
  }
}
