// setWebhook.js
import { Telegraf } from 'telegraf';
import 'dotenv/config';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const webhookUrl = 'https://your-vercel-app.vercel.app/api/telegram';

const setWebhook = async () => {
  try {
    await bot.telegram.setWebhook(webhookUrl);
    console.log(`✅ Webhook set to ${webhookUrl}`);
  } catch (err) {
    console.error('❌ Failed to set webhook:', err.message);
  }
};

setWebhook();
