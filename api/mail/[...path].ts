const HOSTINGER_BASE = 'https://api.mail.hostinger.com'

export default async function handler(req: any, res: any) {
  const token = process.env.HOSTINGER_MAIL_TOKEN
  if (!token) {
    res.status(500).json({ error: 'HOSTINGER_MAIL_TOKEN not configured' })
    return
  }

  const parsed = new URL(req.url, 'http://localhost')
  const prefix = '/api/mail'
  let path = parsed.pathname.startsWith(prefix)
    ? parsed.pathname.slice(prefix.length)
    : parsed.pathname
  path = path.replace(/^\//, '')

  const target = new URL(`${HOSTINGER_BASE}/api/v1/${path}`)
  parsed.searchParams.forEach((value: string, key: string) =>
    target.searchParams.append(key, value),
  )

  let rawBody: string | undefined
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks: Buffer[] = []
    for await (const chunk of req) chunks.push(chunk as Buffer)
    rawBody = Buffer.concat(chunks).toString()
  }

  const init: RequestInit = {
    method: req.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
  if (rawBody) init.body = rawBody

  try {
    const response = await fetch(target.toString(), init)
    const contentType = response.headers.get('content-type') || ''
    const body = await response.text()
    res.status(response.status)
    res.setHeader('content-type', contentType || 'application/json')
    res.send(body)
  } catch {
    res.status(502).json({ error: 'Failed to reach Hostinger Mail API' })
  }
}
