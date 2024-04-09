export async function retryRequest<T = unknown>(
  url: RequestInfo,
  options: FetchOptions<T>
) {
  return useFetch(url, { ...options })
}
