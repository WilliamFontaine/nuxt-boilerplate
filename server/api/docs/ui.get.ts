import { isSwaggerEnabled } from '@@/lib/swagger'

// Swagger UI interface - not included in documentation
export default defineEventHandler(async (event) => {
  // Check if documentation is accessible
  if (!isSwaggerEnabled()) {
    throw createError({
      statusCode: HTTP_STATUS.FORBIDDEN,
      statusMessage: 'API documentation is not available in production'
    })
  }

  // Set Content-Type for HTML
  setHeader(event, 'Content-Type', 'text/html')

  // Swagger UI interface
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Nuxt Boilerplate API Documentation" />
    <title>Nuxt Boilerplate - API Documentation</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
    <style>
      html {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }
      *, *:before, *:after {
        box-sizing: inherit;
      }
      body {
        margin:0;
        background: #fafafa;
      }
      .swagger-ui .topbar {
        background-color: #2c3e50;
      }
      .swagger-ui .topbar .download-url-wrapper {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js" crossorigin></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/api/docs',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "StandaloneLayout",
          docExpansion: 'list',
          tryItOutEnabled: true
        });
      };
    </script>
  </body>
</html>
  `.trim()
})
