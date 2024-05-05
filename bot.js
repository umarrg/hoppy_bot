const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const sdk = require('@api/leonardoai');
const axios = require("axios");
const OpenAI = require("openai");
const fs = require("fs");
const bot = new TelegramBot("7082906196:AAEUHqa9xXnOTwEic794zeSO2ekRtkxx-o4", { polling: true });
const PORT = process.env.PORT || 9000
const openai = new OpenAI({
    apiKey: 'sk-proj-hlpLMjlkASE01dd8rY3LT3BlbkFJRJ9fzIGqFemIvtP2VUst'
});
sdk.auth('9371a660-89ee-4ca2-91dc-eb00a9d22b02');
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));
app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', payload: "Hoppy Coin API" });
});


const commands = [
    { command: '/start', description: 'Start the bot' },
    { command: '/help', description: 'Display this help message' },
    { command: '/image', description: 'Generate an image based on the provided prompt' },

];

bot.setMyCommands(commands);


bot.onText(/\/start/, (msg, match) => {
    let name = msg.chat.first_name;

    const chatId = msg.chat.id;
    const welcomeMessage = `Hey ${name}! \n \nWelcome to Hoppy Coin AI Image Generation Bot! Here are some commands you can use: \n \n - /start: Start the bot \n - /help: Display this help message  \n - /reset: Reset your chat history  \n - /image: Generate an image from prompt /image < prompt > .  \n\nIf you have any questions or need assistance, feel free to ask! \n  \nDon't forget to check us out on Twitter and Telegram.`;


    const inlineKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Twitter', url: 'https://twitter.com/' },

                ],
                [
                    { text: 'Telegram', url: 'https://t.me/' }
                ]
            ]
        }
    };

    bot.sendMessage(chatId, welcomeMessage, inlineKeyboard);
});
bot.onText(/\/help/, (msg, match) => {
    let name = msg.chat.first_name;

    const chatId = msg.chat.id;
    const welcomeMessage = `Hey ${name}! \n \nWelcome to Hoppy Coin AI Image Generation Bot! Here are some commands you can use: \n \n - /start: Start the bot \n - /help: Display this help message  \n - /reset: Reset your chat history  \n - /image: Generate an image from prompt /image < prompt > .  \n\nIf you have any questions or need assistance, feel free to ask! \n  \nDon't forget to check us out on Twitter and Telegram.`;


    const inlineKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Twitter', url: 'https://twitter.com/' },

                ],
                [
                    { text: 'Telegram', url: 'https://t.me/' }
                ]
            ]
        }
    };

    bot.sendMessage(chatId, welcomeMessage, inlineKeyboard);
});
bot.onText(/\/image (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const prompt = match[1];
    const generatingMessage = await bot.sendMessage(chatId, "Generating...");

    try {
        const { data } = await sdk.createGeneration({
            alchemy: true,
            height: 768,
            modelId: '6ae2cf59-8f44-49a2-a63a-e24dba222d6c',
            num_images: 1,
            presetStyle: 'DYNAMIC',
            prompt: prompt,
            width: 1024
        });



        const generationId = data.sdGenerationJob.generationId;

        setTimeout(async () => {
            try {
                const genData = await sdk.getGenerationById({ id: generationId });
                const imageUrl = genData.data.generations_by_pk.generated_images[0].url;
                await bot.sendPhoto(chatId, imageUrl);
            } catch (error) {
                console.error(error);
                await bot.sendMessage(chatId, "Error retrieving generated image.");
            }
        }, 50000);

    } catch (err) {
        console.error(err);
        await bot.sendMessage(chatId, "Failed to generate image.");
    } finally {
        setTimeout(async () => {
            await bot.deleteMessage(chatId, generatingMessage.message_id);

        }, 50000);
    }
});




app.listen(PORT, () => {
    console.log('Bot listening on port ' + PORT)
});