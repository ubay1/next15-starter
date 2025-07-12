

import { dehydrate } from '@tanstack/react-query'
import { getQueryClient } from './query-client'

export async function prefetchQuery<T>(options: {
  queryKey: unknown[]
  queryFn: () => Promise<T>
}) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: options.queryKey,
    queryFn: options.queryFn
  })
  return dehydrate(queryClient)
}
