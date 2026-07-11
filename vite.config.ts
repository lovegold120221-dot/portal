/// <reference types="vitest/config" />
import path from 'path'
import { defineConfig, type Connect, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { playwright } from '@vitest/browser-playwright'
import fs from 'fs'
import type http from 'http'

function loadLocalEnv(): Record<string, string> {
  const envPath = path.resolve(__dirname, './.env')
  const out: Record<string, string> = {}
  try {
    const raw = fs.readFileSync(envPath, 'utf-8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      let val = m[2].trim()
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      out[m[1]] = val
    }
  } catch {
    /* no .env */
  }
  return out
}

function proxyHandler(base: string, token: string | undefined) {
  return async (req: Connect.IncomingMessage, res: http.ServerResponse) => {
    if (!token) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'API token not configured in .env' }))
      return
    }
    const upstream = `${base}${req.url || ''}`
    const method = req.method || 'GET'
    let body: string | undefined
    if (method !== 'GET' && method !== 'HEAD') {
      const chunks: Buffer[] = []
      for await (const c of req) chunks.push(c as Buffer)
      body = Buffer.concat(chunks).toString()
    }
    try {
      const upstreamRes = await fetch(upstream, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
      })
      const contentType = upstreamRes.headers.get('content-type') || ''
      const text = await upstreamRes.text()
      res.statusCode = upstreamRes.status
      if (contentType) res.setHeader('Content-Type', contentType)
      res.end(text)
    } catch {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: `Failed to reach ${base}` }))
    }
  }
}

function devApiProxy() {
  const env = loadLocalEnv()
  return {
    name: 'dev-api-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(
        '/api/mail',
        proxyHandler(
          'https://api.mail.hostinger.com/api/v1',
          env.HOSTINGER_MAIL_TOKEN
        )
      )
      server.middlewares.use(
        '/api/clerk',
        proxyHandler('https://api.clerk.com/v1', env.CLERK_SECRET_KEY)
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    devApiProxy(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    silent: 'passed-only',
    unstubEnvs: true,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
    coverage: {
      // include: ['src/**/*.{js,jsx,ts,tsx}'], // Uncomment to expand the report to all src/**/* so untested modules appear as 0% coverage.
      exclude: [
        'src/components/ui/**',
        'src/assets/**',
        'src/tanstack-table.d.ts',
        'src/routeTree.gen.ts',
        'src/test-utils/**',
        'src/routes/**',
      ],
    },
  },
})
