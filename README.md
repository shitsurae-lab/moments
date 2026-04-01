# Moments (Instagram Clone)

Next.jsとLaravelを使用した、画像投稿SNSアプリケーションです。

## 技術スタック

- **Frontend**: Next.js 14 (App Router, TypeScript, Tailwind CSS, shadcn/ui)
- **Backend**: Laravel 11 (PHP 8.3-fpm)
- **Infrastructure**: Docker / Docker Compose (Nginx, MySQL 8.0)

---

## 🚀 開発環境の起動

```bash
docker compose up -d
```

- Frontend: http://localhost:3080
- Backend (API): http://localhost:8000

---

## 🎨 スタイル設計の指針

Tailwind CSS v4の「CSS-first」な設計思想に基づき、責務を明確に分離しています。

| ファイル     | 役割                                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `layout.tsx` | `next/font` によるフォント最適化や、動的な状態（Theme Mode 等）の注入。Next.js ランタイム機能を利用する起点として定義。                                      |
| `global.css` | `@theme inline` によるテーマ変数定義と `@layer base` による標準スタイルの適用。スタイルの優先順位を整理し、Tailwind ユーティリティによる上書き可能性を担保。 |

---

## 🏗️ アーキテクチャのこだわり

単なる画面制作に留まらず、実務を想定したフルスタックな構成を目指しています。

- **リバースプロキシによる統合**: Nginxをフロントに立て、Next.js (Frontend) とLaravel (Backend) へのリクエストを適切にルーティング。
- **型安全な API 連携**: BackendのスキーマをFrontendで共有し、TypeScriptによる堅牢な開発体験を追求。
- **コンテナオーケストレーション**: Docker Composeを活用し、`docker compose up` だけで動く開発環境のポータビリティを確保。

---

## ✅ 実装済み機能

### Frontend (Next.js)

#### 外部 API 連携 (Unsplash)

- `fetch` APIを用いた非同期通信により、高品質な画像データをリアルタイムに取得。
- サーバーサイドとクライアントサイドの境界を意識した設計。
- APIレスポンスに基づいたTypeScriptインターフェイスを定義し、型安全性を確保。

#### データフェッチの抽象化 (Custom Hooks)

- `usePhotoGallery` カスタムフックにより、ローディング状態・エラーハンドリング・データ取得ロジックをコンポーネントから分離。

#### UX・パフォーマンス

- **Skeleton Screen**: shadcn/uiを活用し、画像読み込み中のレイアウトシフト（ガタつき）を防止。
- **アスペクト比の固定**: Tailwind CSSの `aspect-[4/3]` と `next/image (fill)` を組み合わせ、デバイスを問わない一貫したカードレイアウトを実現。
- **自動無限スクロール**: `react-intersection-observer` でページ最下部への到達を検知し、次ページを自動ロード。Paginationにより初期読み込みの高速化とメモリ節約を両立。

#### URL クエリベースの検索システム

- `useRouter` と `useSearchParams` を組み合わせ、検索ワードをURLパラメーター (`?query=...`) に同期。
- ブラウザの「戻る・進む」や検索結果のURL共有（ディープリンク）に対応。
- 検索クエリの変更を検知し、ページ番号を自動リセットするクリーンアップ処理を実装。

#### Unsplash API ガイドラインの遵守

- **Attribution（帰属表記）**: 投稿者アバター・名前からUnsplash公式プロフィールへの動的リンクを配置。
- **リファラル追跡**: すべての外部リンクに `utm_source` パラメーターを付与し、API規約に適合。
- **画像詳細リンク**: 各カード画像からUnsplashのフルサイズ表示ページへの導線を確保。

#### インタラクティブコンポーネント

- **状態管理の分離**: `LikeButton` を独立したクライアントコンポーネントとして切り出し、親要素の再レンダリングを抑制。
- **SVG 制御**: Tailwind CSSの `fill` / `stroke` をインタラクションに応じて動的に切り替え、お気に入り状態を視覚的にフィードバック。

#### 画像アップロード機能

- `FormData` を用いた画像・メタデータの非同期送信。
- `shadcn/ui (Dialog)` を活用したInstagramライクなポップアップ投稿フォーム。
- 環境変数 (`NEXT_PUBLIC_API_URL`) によるAPIエンドポイントの動的切り替え。
- `onSuccess` プロップスにより、アップロード成功時に親のDialogを自動で閉じる連動機能を実装。

#### コンポーネント構成

| ファイル           | 概要                                                                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `page.tsx`         | 投稿フォーム・無限スクロール・Unsplash ギャラリーを統合するメイン画面。                                                                        |
| `PostForm.tsx`     | `FormData` による画像アップロードの核。バリデーション・送信中制御・成功時リセット処理を実装。                                                  |
| `Footer/index.tsx` | 画面下部に固定されるナビゲーション。Home アイコンと、投稿フォームを呼び出す PlusSquare アイコンを配置。`useState` で Dialog の開閉状態を管理。 |
| `layout.tsx`       | 共通 Footer の配置と、コンテンツが被らないための余白（`pb-20` 等）の調整。                                                                     |

---

### Backend (Laravel 11)

#### 1. データベース設計

`php artisan make:model Post -mcr` コマンドでモデル・マイグレーション・コントローラーを一括生成。

`posts` テーブルのカラム:

| カラム       | 内容                                       |
| ------------ | ------------------------------------------ |
| `image_path` | 保存された画像の物理パス（ファイル名含む） |
| `caption`    | 投稿の説明文（nullable）                   |
| `tags`       | カラム区切りのタグ情報（nullable）         |

#### 2. API 機能の有効化

```bash
docker compose exec backend php artisan install:api
```

Laravel 11の軽量設計に基づき、`routes/api.php` を後付けで有効化。Next.jsからの外部HTTPリクエストを受け付ける専用エンドポイントを定義しました。

#### 3. 画像保存ロジック

`PostController@store` メソッドに以下を実装:

- **Validation**: WebPを含む画像形式のチェックとファイルサイズ制限（2MB）。
- **File Storage**: `$request->file('image')->store('posts', 'public')` により `storage/app/public/posts` へ自動保存。`storage:link` によるシンボリックリンクでブラウザ配信。
- **DB Insert**: 保存パスとメタデータを `posts` テーブルに記録。

`app/Models/Post.php` では `$fillable` を設定し、Mass Assignmentからの保護を明示。

#### 4. エンドポイント定義

```php
// routes/api.php
use App\Http\Controllers\PostController;

Route::post('/posts', [PostController::class, 'store']);
```

#### 5. CORS・Nginx 設定

| ファイル               | 変更内容                                                                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config/cors.php`      | フロントエンド（`localhost:3080`）からの API リクエストを許可。`allowed_origins` は環境変数 `FRONTEND_URL` 参照に変更し、開発・本番環境を柔軟に切り替え可能に。 |
| `default.conf` (Nginx) | `client_max_body_size 20M;` を追加。デフォルト制限（1MB）を拡張し、大きな画像ファイルを受け取れるように調整。                                                   |

---

## 💡 設計上の振り返り

- **疎結合なストレージ設計**: Laravelの `store()` メソッドを利用することで、将来的に保存先をローカルからクラウド（Supabase Storage等）へ切り替える際、`.env` の変更のみで対応可能な柔軟性を確保。
- **Laravel 11 の特性**: API機能を `install:api` で明示的に追加するプロセスを通じ、フレームワークの軽量化思想を理解。
- **CORS の環境変数化**: `allowed_origins` をハードコーディングから環境変数参照に変更することで、コードを修正せずに開発・本番を切り替えられる設計を実現。

---

## 🚀 デプロイ (Vercel)

本プロジェクトはモノレポ構造（`frontend/` と `backend/` が混在）のため、以下の設定を適用しています。

| 設定項目         | 値                            |
| ---------------- | ----------------------------- |
| Root Directory   | `frontend`                    |
| Framework Preset | Next.js                       |
| Custom Domain    | https://moments.vector-n.net/ |

### 環境変数

| 変数名                            | 用途                                  |
| --------------------------------- | ------------------------------------- |
| `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` | Unsplash API のアクセスキー           |
| `NEXT_PUBLIC_API_URL`             | バックエンド API のエンドポイント URL |

### デプロイ手順

1. Vercelでリポジトリをインポート。
2. `Settings > General` で **Root Directory** を `frontend` に指定。
3. `Settings > Environment Variables` で上記の環境変数を追加。
4. 再デプロイを実行。

---

## 🚀 デプロイ (Railway / Backend)

バックエンド（Laravel + MySQL）はRailwayにデプロイしています。

### 構成

| サービス | 内容                                  |
| -------- | ------------------------------------- |
| Laravel  | GitHub リポジトリと連携し自動デプロイ |
| MySQL    | Railway 内の MySQL サービスを使用     |

### Railway 用ファイル構成

ローカル開発環境（Docker Compose + Nginxコンテナー分離）とは異なり、Railwayでは1コンテナーにNginx + php-fpmを同梱する構成にしています。

| ファイル                    | 役割                                                               |
| --------------------------- | ------------------------------------------------------------------ |
| `backend/Dockerfile`        | Nginx 同梱・本番用にリライト（webp 対応含む）                      |
| `backend/docker/nginx.conf` | Railway 用 Nginx 設定（`fastcgi_pass` を `127.0.0.1:9000` に変更） |
| `backend/docker/start.sh`   | php-fpm 起動 → migrate → storage:link → Nginx 起動の順次実行       |

> [!NOTE]
> `backend/docker/nginx/default.conf` はローカル開発用として引き続き使用。Railway 用の `nginx.conf` とは別管理。

### 環境変数 (Railway)

| 変数名         | 用途                                 |
| -------------- | ------------------------------------ |
| `APP_KEY`      | Laravel アプリケーションキー         |
| `APP_URL`      | `https://${{RAILWAY_PUBLIC_DOMAIN}}` |
| `DB_HOST`      | `${{MySQL.MYSQLHOST}}`               |
| `DB_PORT`      | `${{MySQL.MYSQLPORT}}`               |
| `DB_DATABASE`  | `${{MySQL.MYSQLDATABASE}}`           |
| `DB_USERNAME`  | `${{MySQL.MYSQLUSER}}`               |
| `DB_PASSWORD`  | `${{MySQL.MYSQLPASSWORD}}`           |
| `FRONTEND_URL` | Vercel のデプロイ URL（CORS 許可用） |
| `PORT`         | `80`                                 |

### デプロイ手順

1. Railwayでプロジェクトを作成しMySQLサービスを追加。
2. GitHubリポジトリを連携し `Root Directory` を `backend` に指定。
3. 上記の環境変数を設定。
4. デプロイを実行。

---

## 🔗 本番環境の全体構成

```
Vercel（Frontend / Next.js）
    ↓ NEXT_PUBLIC_API_URL
Railway（Backend / Laravel）
    ↓ DB接続
Railway MySQL
```

> [!WARNING]
> 画像ストレージは現在 Railway のコンテナ内に保存されています。コンテナが再デプロイされるとファイルが消える可能性があるため、今後 Cloudflare R2 等の外部ストレージへの移行を予定しています。
