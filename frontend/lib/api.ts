export type ApiError = Error & { status?: number };

const baseUrl = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"
).replace(/\/$/, "");

console.log("BASE URL: ", baseUrl)

export async function apiFetch<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  const url = `${baseUrl}${path}`;

  console.log("API base URL:", baseUrl);
  console.log("Actual request URL:", url);
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    signal: init.signal ?? AbortSignal.timeout(45_000),
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(payload?.message)
      ? payload.message.join(", ")
      : payload?.message;
    const error: ApiError = new Error(
      message || `Request failed (${response.status})`,
    );
    error.status = response.status;
    throw error;
  }
  return response.json() as Promise<T>;
}
