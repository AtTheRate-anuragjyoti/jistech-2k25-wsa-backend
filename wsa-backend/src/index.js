import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Animesh Charan!')
})

export default app
