module.exports = {
  apps: [
    {
      name: 'pour-bien-vivre-ensemble',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=pbve-realisations --local --ip 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        CLOUDFLARE_API_TOKEN: 'FKrfcXLmIjB3ej6vZ3_3huY9m84NcA4lOyuPTeT9'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}