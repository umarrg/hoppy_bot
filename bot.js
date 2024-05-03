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



bot.onText(/\/image (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const prompt = match[1];
    const generatingMessage = await bot.sendMessage(chatId, "Generating...");

    try {
        const { data } = await sdk.createGeneration({
            alchemy: true,
            height: 768,
            modelId: 'f1f97b17-d902-4bc9-a5b7-965556950305',
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