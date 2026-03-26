# Moments (Instagram Clone)

Next.jsとLaravelを使用した、画像投稿SNSアプリケーションです。

## 技術スタック

- **Frontend**: Next.js 14 (App Router, TypeScript, Tailwind CSS, shadcn/ui)
- **Backend**: Laravel 13 (PHP 8.3-fpm)
- **Infrastructure**: Docker / Docker Compose (Nginx, MySQL 8.0)

---

## 🎨 スタイル設計の指針

Tailwind CSS v4の「CSS-first」な設計思想に基づき、責務を明確に分離しています。

- **layout.tsx (System Integration / Entry Point)**
  - **役割**: `next/font` によるフォント最適化や、動的な状態（Theme Mode等）の注入。
  - **理由**: Next.jsのランタイム機能を利用する「仕組み」の起点として定義するため。
- **global.css (Design Tokens / Base Styles)**
  - **役割**: `@theme inline` によるテーマ変数定義と `@layer base` による標準スタイルの適用。
  - **理由**: スタイルの優先順位（Specificity）を整理し、Tailwindユーティリティによる上書き可能性を担保するため。

---

## 開発環境の起動方法

```bash
docker compose up -d
```

---

## プレビュー

- Frontend: http://localhost:3080
- Backend (API): http://localhost:8000
