import { ChatPromptTemplate } from '@langchain/core/prompts'
import {
    RunnablePassthrough,
    RunnableSequence,
} from '@langchain/core/runnables'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { init } from '~/services/gemini-ai/services/pinecone'
import { model } from '~/services/gemini-ai/aiAgen'

export async function getInformasiProductKonek(prompting: string) {
    console.log(prompting)

    try {
        const vectorStore = await init()
        const prompt = ChatPromptTemplate.fromTemplate(`
            Jawab pertanyaan hanya berdasarkan pada context yang disediakan.
    
            Context: {context}
    
            Question: {question}
        `)

        const ragChain = RunnableSequence.from([
            {
                context: vectorStore.asRetriever(),
                question: new RunnablePassthrough(),
            },
            prompt,
            model,
            new StringOutputParser(),
        ])

        const data = await ragChain.invoke(prompting)

        return data
    } catch (error) {
        console.log('error', error)
        return 'Error'
    }
}
