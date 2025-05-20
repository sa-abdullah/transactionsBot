import axios from 'axios'
import 'dotenv/config'
import { formatUnits, formatEther } from 'ethers'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'


export const queryGroq = async (mcpContext) => {
    try {

        const response = await axios.post(
            GROQ_API_URL, 
            {
                model: 'llama-3.3-70b-versatile', 
                messages: [
                    {
                        role: 'system', 
                        content: `You are LedgerLook, a helpful blockchain assistant that analyses transactions and answers any other questions on blockchain`
                    }, 
                    {
                        role: 'user', 
                        content: JSON.stringify(mcpContext)
                    }
                ]
            }, 
            {
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
                }, 

            }
        )
        console.log(response.data)
        return response.data.choices[0].message.content

    } catch (error) {
        console.error( 'GROQ API Error', error.response?.data || error.message)
        return 'Sorry. I could not analyse this response at the moment'
    }
}

export const createMCPContext = (transaction) => {
    return {
        context: [
            {
                type: 'transaction', 
                content: {
                    hash: transaction?.hash, 
                    from: transaction?.from, 
                    to: transaction?.to, 
                    value: formatEther(transaction?.value), 
                    gasLimit: transaction?.gasLimit?.toString(), 
                    gasPrice: transaction?.gasPrice ? formatUnits(transaction?.gasPrice, 'gwei') + 'gwei' : 'N/A', 
                    nonce: transaction?.nonce, 
                    data: transaction?.data, 
                    blockHash: transaction?.blockHash, 
                    blockNumber: transaction?.blockNumber, 
                    confirmations: transaction?.confirmations,
                }

            }
        ], 
        query: 'Explain this Ethereum transaction in simple terms for a user',
    }
}
