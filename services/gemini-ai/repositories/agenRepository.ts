import { agentExecutor } from '~/services/gemini-ai/aiAgen'
import { removeTrailingNewlines } from '~/services/gemini-ai/helpers/stringHelper'
import { findChatByContacts } from '~/repository/chatHistoryRepository'

export async function askAgen(session_id: number, content: string) {
    const agen = await agentExecutor()

    try {
        const chat_history = await findChatByContacts(session_id, 'asc')

        let history = chat_history.map((item) => {
            return {
                role: item.role,
                content: item.content,
            }
        })

        const response = await agen.invoke({
            chat_history: history,
            input: content,
        })

        let output = removeTrailingNewlines(response.output)

        return output
    } catch (error: any) {
        return 'error'
    }
}
