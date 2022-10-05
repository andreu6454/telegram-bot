const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions, loseOptions} = require('./options')
const sequelize = require('./db')
const UserModel = require('./models')
const {token} = require('./token')



const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) =>{
    await bot.sendMessage(chatId, 'I guess number from 0 to 9')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, "Choose right one", gameOptions)
}

const start = async () =>{
    try{
        await sequelize.authenticate()
        await sequelize.sync()
    }catch (e){

    }

    bot.setMyCommands([
        {command: '/start' , description: 'initial greeting'},
        {command: '/info' , description: 'user description'},
        {command: '/game' , description: 'try to guess number'},
    ])

    bot.on('message', async (msg) => {
        const text = msg.text
        const chatId = msg.chat.id
        try {
            if (text === '/start') {
                const user = await UserModel.findOne({chatId})
                console.log(user)
                if(user === null){
                    await UserModel.create({chatId})
                }
                await bot.sendPhoto(chatId,'IMG_4658.PNG')
                return  bot.sendMessage(chatId, `Hello, bro`)
            }
            if (text === '/info') {
                const user = await UserModel.findOne({chatId})
                return  bot.sendMessage(chatId, `Your name: ${msg.from.first_name}, you have ${user.right} correct answers and ${user.wrong} wrong.`)
            }
            if(text === '/game'){
                await bot.sendPhoto(chatId,'IMG_4657.PNG')
                return startGame(chatId)
            }
            return bot.sendMessage(chatId, 'i don\'t understand you.')
        } catch (e){
            console.log(e)
            return bot.sendMessage(chatId, 'Error')
        }
    })

    bot.on('callback_query', async msg =>{
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === "/again"){
            return startGame(chatId)
        }
        if(data === "/answer"){
            await bot.sendMessage(chatId, 'My number was: ' + chats[chatId])
            return startGame(chatId)
        }
        const user = await UserModel.findOne({chatId})

        if(data == chats[chatId]){
            user.right += 1;
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp')
            await bot.sendMessage(chatId, 'Congratulations! Correct number was: ' + chats[chatId], againOptions)
        }else {
            user.wrong += 1;
            await bot.sendMessage(chatId, 'You lose. Try again or check number and start again',loseOptions)
        }
        await user.save();
    })

}

start()