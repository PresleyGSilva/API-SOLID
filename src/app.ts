import fastify from 'fastify'
import { appRoutes } from '@http/routes.ts/routes'
import { env } from '@env'
import { ZodError } from 'zod'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
  }
  return reply.status(500).send({ mesage: 'Internal server error.' })
})
