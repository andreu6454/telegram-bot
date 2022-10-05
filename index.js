const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '5547577517:AAGjjV7tEgQGra9o_fmOdJorB7gSZV2Q-M4'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) =>{
    await bot.sendMessage(chatId, 'Загадываю от 0 до 9')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, "Отгадывай", gameOptions)
}

const start = () =>{
    bot.setMyCommands([
        {command: '/start' , description: 'Начальное приветствие'},
        {command: '/info' , description: 'Инфо'},
        {command: '/game' , description: 'Угадай число'},
    ])

    bot.on('message', async (msg) => {
        const text = msg.text
        const chatId = msg.chat.id
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/c6a/83f/c6a83f6c-8cab-4b84-82ac-1689269219d5/5.webp')
            return  bot.sendMessage(chatId, `Hello, bro`)
        }
        if (text === '/info') {
            return  bot.sendMessage(chatId, `Your name: ${msg.from.first_name}`)
        }
        if(text === '/aboutErik') {
            await bot.sendMessage(chatId, 'Эрик пидор!')
            await bot.sendMessage(chatId, 'Эрик пидор!')
            return  bot.sendMessage(chatId, 'Эрик пидор!')
        }
        if(text === '/game'){
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю.')
    })

    bot.on('callback_query', async msg =>{
        const data = Number(msg.data)
        const chatId = msg.message.chat.id
        if(data === "/again"){
            return startGame(chatId)
        }
        if(data === chats[chatId]){
            return await bot.sendMessage(chatId, 'Congratulations. Correct number was: ' + chats[chatId], againOptions)
        }else {
            return await bot.sendMessage(chatId, 'You lose. Correct number was: ' + chats[chatId], againOptions)
        }
    })

}

start()