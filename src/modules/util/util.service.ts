import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
@Injectable()
export class UtilService {
  private readonly bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN);
  }

  async sendTelegramCheckInMessage(chatId: string, message: string) {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (error) {
      console.log(error);
    }
  }

  async sendTelegramCheckOutMessage(chatId: string, message: string) {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (error) {
      console.log(error);
    }
  }
}
