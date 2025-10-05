import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

type Bindings = {
  DB: D1Database
  STORAGE: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', logger())
app.use('*', cors())

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.get('/api/projects', async (c) => {
  const db = c.env.DB
  const result = await db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all()
  return c.json(result.results)
})

app.post('/api/projects', async (c) => {
  const body = await c.req.json()
  // TODO: Validation with Zod
  // TODO: Create project
  return c.json({ message: 'Not implemented yet' }, 501)
})

app.get('/api/projects/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  const result = await db.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first()
  
  if (!result) {
    return c.json({ error: 'Project not found' }, 404)
  }
  
  return c.json(result)
})

export default app
