import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { request } from '@/lib/request'

export const ChatService = {
  chatCompletions: (body: Chat.CompletionRequestBody) => request.post<Response>('/v1/chat/completions', { body, timeout: null, stream: true }),
  getModels: () => request.get<Chat.ModelsResponse>('/v1/models'),
}

export const CHAT_QUERY_KEYS = {
  getModels: ['getModels'],
}

export const createModelsQueryOptions = () =>
  queryOptions({
    queryKey: CHAT_QUERY_KEYS.getModels,
    queryFn: ChatService.getModels,
  })

export function useModelsQuery() {
  return useSuspenseQuery(createModelsQueryOptions())
}
