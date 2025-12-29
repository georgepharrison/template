interface CustomFetchOptions {
  url: string;
  method: string;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export const customFetch = async <T>({
  url,
  method,
  params,
  data,
  headers,
  signal,
}: CustomFetchOptions): Promise<T> => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined)
      )
    : undefined;

  const searchParams = filteredParams
    ? `?${new URLSearchParams(filteredParams as Record<string, string>)}`
    : '';

  const response = await fetch(`${url}${searchParams}`, {
    method,
    headers:
      headers ?? (data ? { 'Content-Type': 'application/json' } : undefined),
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorBody;
    try {
      errorBody = JSON.parse(errorText);
    } catch {
      errorBody = { detail: errorText };
    }
    throw errorBody;
  }

  const text = await response.text();
  if (!text) return undefined as T;

  try {
    return JSON.parse(text);
  } catch {
    return text as T;
  }
};
