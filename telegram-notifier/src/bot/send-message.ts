import {bot} from '../lib/bot.js';
import {logger} from '../lib/config.js';
import {storage} from '../lib/storage.js';

export async function sendMessage(to: string, message: string): Promise<void> {
  logger.logMethodArgs('sendMessage', {to, message});

  const target = storage.get(to);
  if (target === null) {
    logger.incident('sendMessage', 'target_not_found', 'no one registered to this toke', {to});
    return;
  }

  for (const chatId of target.memberList) {
    try {
      await bot.telegram.sendMessage(chatId, message, {parse_mode: 'MarkdownV2'});
    }
    catch (err) {
      // TODO: handle blocked user
      logger.error('sendMessage', 'error_send_message', (err as Error).stack || err, {chatId});
    }
  }
}
