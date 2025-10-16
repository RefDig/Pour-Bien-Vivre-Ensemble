import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'Pour Bien Vivre Ensemble - Association'}</title>
        
        {/* Meta SEO */}
        <meta name="description" content="Association Pour Bien Vivre Ensemble - Favorisons le lien social et la solidarité dans notre communauté" />
        <meta name="keywords" content="association, solidarité, lien social, communauté, bien vivre ensemble" />
        <meta name="author" content="Pour Bien Vivre Ensemble" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title || 'Pour Bien Vivre Ensemble'} />
        <meta property="og:description" content="Association Pour Bien Vivre Ensemble - Favorisons le lien social et la solidarité dans notre communauté" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title || 'Pour Bien Vivre Ensemble'} />
        <meta name="twitter:description" content="Association Pour Bien Vivre Ensemble - Favorisons le lien social et la solidarité dans notre communauté" />
        
        {/* PWA Meta */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PBVE" />
        
        {/* Favicon et icons */}
        <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/icon-192.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/static/manifest.json" />
        
        {/* Styles */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body className="bg-gray-50 font-sans">
        {children}
        {/* Si tu as besoin d'un JS global supplémentaire, garde-le ici : */}
        {/* <script src="/static/app.js"></script> */}
      </body>
    </html>
  )
})