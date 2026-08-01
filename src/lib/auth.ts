function parseCredentials(value: string): { username: string; password: string } | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const colonIndex = trimmed.indexOf(':');
  if (colonIndex !== -1) {
    return {
      username: trimmed.slice(0, colonIndex),
      password: trimmed.slice(colonIndex + 1)
    };
  }

  const commaIndex = trimmed.indexOf(',');
  if (commaIndex !== -1) {
    return {
      username: trimmed.slice(0, commaIndex),
      password: trimmed.slice(commaIndex + 1)
    };
  }

  return null;
}

export function verifyBasicAuth(request: Request): boolean {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return false;
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Basic ')) {
    return false;
  }

  const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8');
  const credentials = parseCredentials(decoded);
  if (!credentials) {
    return false;
  }

  return credentials.username === username && credentials.password === password;
}

export function unauthorizedResponse(): Response {
  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }
  });
}

export function requireAuth(request: Request): Response | null {
  if (!verifyBasicAuth(request)) {
    return unauthorizedResponse();
  }
  return null;
}
