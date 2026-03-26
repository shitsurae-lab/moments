# node:22-alpine を使用（最新の安定版）
FROM node:22-alpine

# 作業ディレクトリを /app に設定（docker-compose.ymlと合わせる）
WORKDIR /app

# Next.js の動作に必要な互換ライブラリをインストール
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache libc6-compat

# ポート 3080 を開放
EXPOSE 3080

# 開発用サーバーを起動
# (npx create-next-app 完了後に npm run dev が使えるようになります)
CMD ["npm", "run", "dev"]
