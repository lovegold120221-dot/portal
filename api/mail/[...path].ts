import type { VercelRequest, VercelResponse } from '@vercel/node'

const HOSTINGER_BASE = 'https://api.mail.hostinger.com'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = process.env.HOSTINGER_MAIL_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'HOSTINGER_MAIL_TOKEN not configured' })
  }

  const path = Array.isArray(req.query.path)
    ? req.query.path.join('/')
    : (req.query.path as string) || ''

  const url = `${HOSTINGER_BASE}/api/v1/${path}`

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue
    const values = Array.isArray(value) ? value : [value]
    for (const v of values) {
      if (v !== undefined) searchParams.append(key, String(v))
    }
  }
  const queryString = searchParams.toString()
  const fullUrl = queryString ? `${url}?${queryString}` : url

  const init: RequestInit = {
    method: req.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }

  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = JSON.stringify(req.body)
  }

  try {
    const response = await fetch(fullUrl, init)
    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const data = await response.json()
      return res.status(response.status).json(data)
    }

    const text = await response.text()
    return res.status(response.status).send(text)
  } catch {
    return res.status(502).json({ error: 'Failed to reach Hostinger Mail API' })
  }
}
