import { defineConfig } from '@foadonis/openapi'

export default defineConfig({
  ui: 'scalar',
  document: {
    info: {
      title: 'FlowSync API',
      version: 'v1',
    },
    components: {
      securitySchemes: {
        // El nombre lo fija `@ApiBearerAuth()`, que siempre referencia `bearer`.
        bearer: {
          type: 'http',
          scheme: 'bearer',
          description: 'Access token opaco del guard `api`.',
        },
      },
    },
  },
})
