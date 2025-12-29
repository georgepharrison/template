export const customFetch = async <T>({
  url,
  method,
  params,
  data,
  signal,
}: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, string | boolean | undefined>;
  data?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}): Promise<T> => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined)
      )
    : undefined;

  const searchParams = filteredParams
    ? `?${new URLSearchParams(filteredParams as Record<string, string>).toString()}`
    : '';

  const response = await fetch(`${url}${searchParams}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Send cookies with requests
    body: data ? JSON.stringify(data) : undefined,
    signal,
  });

  if (!response.ok) {
    // Parse error response for validation errors
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
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text);
};
