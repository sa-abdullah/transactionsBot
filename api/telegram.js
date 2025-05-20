import { Telegraf } from 'telegraf'
import { JsonRpcProvider } from 'ethers'
import 'dotenv/config'
import { queryGroq, createMCPContext } from '../handlePrompt.js'


const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
const BOT_USERNAME = '@LedgerLook'
// const provider = new InfuraProvider('sepolia', process.env.INFURA_PROJECT_ID)
const provider = new JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`)


    bot.start((ctx) => {
        ctx.reply(`👋Hey! I'm ${BOT_USERNAME}. Send me a tx hash to check transactions. Or ask me something`)
    })

    bot.on('text', async (ctx) => {
        const text = ctx.message.text.trim();
        const txHashMatch = text.match(/0x[a-fA-F0-9]{64}/g)

        if (!txHashMatch) {
            await ctx.reply(await queryGroq(text))
            return 
        }

        const txHash = txHashMatch[0]
        await ctx.reply(`Fetching transaction details for:\n${txHash}`)

        try {
            const transaction = await provider.getTransaction(txHash)
            if (!transaction) {
                await ctx.reply('Transaction not found or still pending. Check your Ethereum transaction Hash')
                return
            }

            const mcpContext = createMCPContext(transaction)
            await ctx.reply(await queryGroq(mcpContext))

        } catch (error) {
            console.error('Error fetching transaction: ', error);
            await ctx.reply('Error fetching transaction. Please try again later')
        }
    })


export default async function handler (req, res) {
    if (req.method === 'POST') {
        try {
            await bot.handleUpdate(req.body)
            res.status(200).send('OK')
        } catch (error) {
            console.error('Telegram Webhook error', error)
            res.status(500).send('Bot error')
        }
    } else {
        res.status(405).send('Method Not Allowed')
    }
}


