import { request } from '@/lib/request'

export const ChatService = {
  chatCompletions: (body: Chat.CompletionRequestBody) => request.post<Response>('/v1/chat/completions', { body, timeout: null, stream: true }),
  getModels: () => request.get<Chat.ModelsResponse>('/v1/models'),
}
