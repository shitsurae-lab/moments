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

## 🏗️ アーキテクチャのこだわり

単なる画面制作に留まらず、実務を想定したフルスタックな構成を目指しています。

- **リバースプロキシによる統合**: Nginxをフロントに立て、Next.js(Frontend)とLaravel(Backend)へのリクエストを適切にルーティング。
- **型安全なAPI連携**: BackendのスキーマをFrontendで共有し、TypeScriptによる堅牢な開発体験を追求。
- **コンテナオーケストレーション**: Docker Composeを活用し、開発環境のポータビリティ（誰でも `up` するだけで動く状態）を確保。

---

## 開発環境の起動方法

```bash
docker compose up -d
```

---

## 🚀 実装済みのコア機能 (Frontend)

直近のアップデートで、外部APIを活用した動的なデータサイクルの基礎を構築しました。

- **外部API連携 (Unsplash)**:
  - `fetch` APIを用いた非同期通信により、高品質な画像データをリアルタイムに取得。
  - サーバーサイドとクライアントサイドの境界を意識した設計。
- **堅牢な型定義**:
  - APIレスポンスに基づいたTypeScriptインターフェイスを定義し、開発時の予期せぬエラーを防止。
- **データフェッチの抽象化 (Custom Hooks)**:
  - `usePhotoGallery` カスタムフックにより、ローディング状態・エラーハンドリング・データ取得ロジックをコンポーネントから分離。
- **UXを考慮したローディング設計 (Skeleton Screen)**:
  - shadcn/uiを活用し、画像読み込み中のレイアウトシフト（ガタつき）を防止するスケルトンUIを実装。
- **アスペクト比の固定**:
  - Tailwind CSSの `aspect-[4/3]` と `next/image` (fill) を組み合わせ、デバイスを問わない一貫したカードレイアウトを実現。

---

## プレビュー

- Frontend: http://localhost:3080
- Backend (API): http://localhost:8000
