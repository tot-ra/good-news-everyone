set shell := ["zsh", "-cu"]

start:
  npm run start

build:
  npm run build

# Publish a local Vite build the same way production nginx expects it (dist -> public).
publish: build
  rm -rf public
  mv dist public
  @echo "Published to ./public (nginx root on server: /www/good.kurapov.ee/public)"
