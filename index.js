const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const token = '5881878845:AAF82RsPjgXRzrfKpjSapdGnStyGUrqDgMg';
const webAppUrl = 'https://react-bot-app.vercel.app/';


const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {

    await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
      reply_markup: {
        keyboard: [
          [{ text: 'Заполнить форму', web_app: {url: webAppUrl + 'form'}}]
        ]
      }
    })

    await bot.sendMessage(chatId, 'Заходи в наш интернет-магазин', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Сделать заказ', web_app: {url: webAppUrl}}]
        ]
      }
    })
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      await bot.sendMessage(chatId, 'Спасибо за обратную связь!');
      await bot.sendMessage(chatId, 'Ваша страна ' + data?.country);
      await bot.sendMessage(chatId, 'Ваша улица ' + data?.street);

      setTimeout( async () => {
        await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
      }, 3000)
    } catch (error) {
      console.log(error);
    }
  }
});

app.post('/web-data', async (req, res) => {
  const {
    queryId,
    products,
    totalPrice
  } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Успешная покупка',
      imput_message_content: {message_text: `Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`}
    })
    return res.status(200).json({});
  } catch (error) {
    return res.status(400).json({});
  }


})

const PORT = 8080;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
