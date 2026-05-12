import { request } from '@/lib/request'

export const ChatService = {
  chatCompletions: (params: Chat.CompletionParams) => request.post<Response>('/v1/chat/completions', { ...params, timeout: 0 }),
  getModels: () => request.get<Chat.ModelsResponse>('/v1/models'),
}
