import type { VercelRequest, VercelResponse } from '@vercel/node'

const CLERK_BASE = 'https://api.clerk.com/v1'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = process.env.CLERK_SECRET_KEY
  if (!token) {
    return res
      .status(500)
      .json({ error: 'CLERK_SECRET_KEY not configured' })
  }

  const path = Array.isArray(req.query.path)
    ? req.query.path.join('/')
    : (req.query.path as string) || ''

  const url = `${CLERK_BASE}/${path}`

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
    return res
      .status(502)
      .json({ error: 'Failed to reach Clerk Backend API' })
  }
}
