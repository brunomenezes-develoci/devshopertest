chokidar "**/*.{liquid,css,js,json}" ^
  --throttle 1500 ^
  -c "echo 'Alteração detectada. Enviando para Shopify...' && shopify theme push --store devshopertest.myshopify.com --theme 153891143933 --path . --ignore README.md --ignore \"locales/*.json\"" & echo