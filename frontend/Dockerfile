# node:22-alpine を使用
FROM node:22-alpine

# 作業ディレクトリを設定
WORKDIR /app

# Next.js の動作に必要な互換ライブラリをインストール
RUN apk add --no-cache libc6-compat

# 1. package.json と package-lock.json を先にコピー
COPY package*.json ./

# 2. コンテナの中でインストールを実行（これでLinux用のバイナリが入るよ！）
RUN npm install

# 3. swcのLinux用バイナリを明示的にインストール
RUN npm install @next/swc-linux-x64-musl --cpu=x64 --os=linux

# 4. 残りのソースコードをコピー
COPY . .

# ポートを開放（Next.jsのデフォルトは3000、composeで3080にマッピング）
EXPOSE 3000

# 開発用サーバーを起動
CMD ["npm", "run", "dev"]
