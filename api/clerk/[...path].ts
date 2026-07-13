const CLERK_BASE = 'https://api.clerk.com/v1'

export default async function handler(req: any, res: any) {
  const token = process.env.CLERK_SECRET_KEY
  if (!token) {
    res.status(500).json({ error: 'CLERK_SECRET_KEY not configured' })
    return
  }

  const parsed = new URL(req.url, 'http://localhost')
  const prefix = '/api/clerk'
  let path = parsed.pathname.startsWith(prefix)
    ? parsed.pathname.slice(prefix.length)
    : parsed.pathname
  path = path.replace(/^\//, '')

  const target = new URL(`${CLERK_BASE}/${path}`)
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
    res.status(502).json({ error: 'Failed to reach Clerk Backend API' })
  }
}
