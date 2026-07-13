const HOSTINGER_BASE = 'https://api.mail.hostinger.com'

export default async function handler(req: Request): Promise<Response> {
  const token = process.env.HOSTINGER_MAIL_TOKEN
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'HOSTINGER_MAIL_TOKEN not configured' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    )
  }

  const url = new URL(req.url)
  const prefix = '/api/mail'
  let path = url.pathname.startsWith(prefix)
    ? url.pathname.slice(prefix.length)
    : url.pathname
  path = path.replace(/^\//, '')

  const target = new URL(`${HOSTINGER_BASE}/api/v1/${path}`)
  url.searchParams.forEach((value, key) => target.searchParams.append(key, value))

  const init: RequestInit = {
    method: req.method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.text()
  }

  try {
    const response = await fetch(target.toString(), init)
    const contentType = response.headers.get('content-type') || ''
    const body = await response.text()
    return new Response(body, {
      status: response.status,
      headers: { 'content-type': contentType || 'application/json' },
    })
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to reach Hostinger Mail API' }),
      { status: 502, headers: { 'content-type': 'application/json' } },
    )
  }
}
