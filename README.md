# Moments (Instagram Clone)

Next.jsとLaravelを使用した、画像投稿SNSアプリケーションです。

## 技術スタック

- **Frontend**: Next.js 16 (App Router, TypeScript, Tailwind CSS, shadcn/ui)
- **Backend**: Laravel 11 (PHP 8.3-fpm)
- **Storage**: Cloudflare R2（画像ストレージ）
- **Infrastructure**: Docker / Docker Compose (Nginx, MySQL 8.0)

---

## 🚀 開発環境の起動

```bash
docker compose up -d
```

- Frontend: http://localhost:3080
- Backend (API): http://localhost:8000

### ⚠️ パッケージ管理の注意点

`node_modules` はDockerコンテナー内のLinux用バイナリが必要なため、**必ずコンテナー内でインストール**してください。Mac側（ホスト）で `npm install` を実行すると、Mac用バイナリが混入してコンテナー内でビルドエラーが発生します。

```bash
# ✅ 正しい方法（コンテナ内で実行）
docker compose exec frontend npm install

# ❌ やってはいけない方法（Mac側で実行）
npm install
```

### ビルドエラーが起きたときのリセット手順

```bash
docker compose down
rm -rf frontend/.next frontend/package-lock.json frontend/node_modules
docker compose up -d --build
docker compose exec frontend npm install
```

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

- **リバースプロキシによる統合**: NginxをフロントエンドとLaravel（Backend）へのリクエストを適切にルーティング。
- **型安全なAPI連携**: BackendのスキーマをFrontendで共有し、TypeScriptによる堅牢な開発体験を追求。
- **コンテナオーケストレーション**: Docker Composeを活用し、`docker compose up` だけで動く開発環境のポータビリティを確保。
- **クラウドストレージ連携**: 画像をCloudflare R2に保存することで、コンテナー再デプロイ時のファイル消失問題を解消。LaravelのFilesystem抽象化により、`.env` の変更だけで保存先を切り替え可能な設計。

---

## ✅ 実装済み機能

### Frontend (Next.js)

#### 外部API連携 (Unsplash)

- `fetch` APIを用いた非同期通信により、高品質な画像データをリアルタイムに取得。
- サーバーサイドとクライアントサイドの境界を意識した設計。
- APIレスポンスに基づいたTypeScriptインターフェイスを定義し、型安全性を確保。

#### データフェッチの抽象化 (Custom Hooks)

- `usePhotoGallery` カスタムフックにより、ローディング状態・エラーハンドリング・データ取得ロジックをコンポーネントから分離。

#### UX・パフォーマンス

- **Skeleton Screen**: shadcn/uiを活用し、画像読み込み中のレイアウトシフト（ガタつき）を防止。
- **アスペクト比の固定**: Tailwind CSSの `aspect-[4/3]` と `next/image (fill)` を組み合わせ、デバイスを問わない一貫したカードレイアウトを実現。
- **自動無限スクロール**: `react-intersection-observer` でページ最下部への到達を検知し、次ページを自動ロード。Paginationにより初期読み込みの高速化とメモリ節約を両立。

#### URLクエリベースの検索システム

- `useRouter` と `useSearchParams` を組み合わせ、検索ワードをURLパラメーター（`?query=...`）に同期。
- ブラウザの「戻る・進む」や検索結果のURL共有（ディープリンク）に対応。
- 検索クエリの変更を検知し、ページ番号を自動リセットするクリーンアップ処理を実装。

#### Unsplash APIガイドラインの遵守

- **Attribution（帰属表記）**: 投稿者アバター・名前からUnsplash公式プロフィールへの動的リンクを配置。
- **リファラル追跡**: すべての外部リンクに `utm_source` パラメーターを付与し、API規約に適合。
- **画像詳細リンク**: 各カード画像からUnsplashのフルサイズ表示ページへの導線を確保。

#### インタラクティブコンポーネント

- **状態管理の分離**: `LikeButton` を独立したクライアントコンポーネントとして切り出し、親要素の再レンダリングを抑制。
- **SVG制御**: Tailwind CSSの `fill` / `stroke` をインタラクションに応じて動的に切り替え、お気に入り状態を視覚的にフィードバック。

#### 画像アップロード機能

- `FormData` を用いた画像・メタデータの非同期送信。
- `shadcn/ui (Dialog)` を活用したInstagramライクなポップアップ投稿フォーム。
- 環境変数（`NEXT_PUBLIC_API_URL`）によるAPIエンドポイントの動的切り替え。
- `onSuccess` プロップスにより、アップロード成功時に親のDialogを自動で閉じる連動機能を実装。

#### コンポーネント構成

| ファイル           | 概要                                                                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `page.tsx`         | 投稿フォーム・無限スクロール・Unsplashギャラリーを統合するメイン画面。                                                                    |
| `PostForm.tsx`     | `FormData` による画像アップロードの核。title・caption・tagsの入力フォームを実装。バリデーション・送信中制御・成功時リセット処理を実装。   |
| `Footer/index.tsx` | 画面下部に固定されるナビゲーション。Homeアイコンと、投稿フォームを呼び出すPlusSquareアイコンを配置。`useState` でDialogの開閉状態を管理。 |
| `layout.tsx`       | 共通Footerの配置と、コンテンツが被らないための余白（`pb-20` 等）の調整。                                                                  |

---

### Backend (Laravel 11)

#### 1. データベース設計

`php artisan make:model Post -mcr` コマンドでモデル・マイグレーション・コントローラーを一括生成。

`posts` テーブルのカラム:

| カラム            | 内容                                                      |
| ----------------- | --------------------------------------------------------- |
| `image_path`      | R2に保存された画像のパス（ファイル名含む）                |
| `title`           | 投稿のタイトル（nullable）                                |
| `caption`         | 投稿の説明文（nullable）                                  |
| `tags`            | カンマ区切りのタグ情報（nullable）                        |
| `user_name`       | 投稿者名（デフォルト: `anonymous`、認証実装後に更新予定） |
| `user_avatar_url` | 投稿者のアバター画像URL（nullable、認証実装後に更新予定） |

#### 2. API機能の有効化

```bash
docker compose exec backend php artisan install:api
```

Laravel 11の軽量設計に基づき、`routes/api.php` を後付けで有効化。Next.jsからの外部HTTPリクエストを受け付ける専用エンドポイントを定義しました。

#### 3. 画像保存ロジック

`PostController@store` メソッドに以下を実装:

- **Validation**: WebPを含む画像形式のチェックとファイルサイズ制限（2MB）。title・caption・tagsのバリデーションも追加。
- **File Storage**: `$request->file('image')->store('posts', 's3')` によりCloudflare R2の `moments-images` バケットへ保存。Laravelの `league/flysystem-aws-s3-v3` パッケージを使用し、S3互換APIで接続。
- **DB Insert**: 保存パスとメタデータを `posts` テーブルに記録。認証未実装のため `user_name` は `anonymous` で固定。

`app/Models/Post.php` では `$fillable` を設定し、Mass Assignmentからの保護を明示。

#### 4. エンドポイント定義

```php
// routes/api.php
use App\Http\Controllers\PostController;

Route::post('/posts', [PostController::class, 'store']);
```

#### 5. CORS・Nginx設定

| ファイル               | 変更内容                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config/cors.php`      | フロントエンド（`localhost:3080`）からのAPIリクエストを許可。`allowed_origins` は環境変数 `FRONTEND_URL` 参照に変更し、開発・本番環境を柔軟に切り替え可能に。 |
| `default.conf` (Nginx) | `client_max_body_size 20M;` を追加。デフォルト制限（1MB）を拡張し、大きな画像ファイルを受け取れるように調整。                                                 |

#### 6. Cloudflare R2との接続設定

LaravelのFilesystem抽象化（`league/flysystem-aws-s3-v3`）を利用し、S3互換APIでCloudflare R2に接続しています。`config/filesystems.php` の `s3` ドライバーをそのまま流用できるため、コードの変更は最小限です。

```php
// config/filesystems.php（s3ドライバーの設定）
's3' => [
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION'),
    'bucket' => env('AWS_BUCKET'),
    'url' => env('AWS_URL'),
    'endpoint' => env('AWS_ENDPOINT'),
    'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
],
```

必要な環境変数（`.env` およびRailway Variables）:

| 変数名                        | 値                                     |
| ----------------------------- | -------------------------------------- |
| `FILESYSTEM_DISK`             | `s3`                                   |
| `AWS_ACCESS_KEY_ID`           | R2のAccess Key ID                      |
| `AWS_SECRET_ACCESS_KEY`       | R2のSecret Access Key                  |
| `AWS_DEFAULT_REGION`          | `auto`                                 |
| `AWS_BUCKET`                  | `moments-images`                       |
| `AWS_URL`                     | R2エンドポイントURL                    |
| `AWS_ENDPOINT`                | R2エンドポイントURL（AWS_URLと同じ値） |
| `AWS_USE_PATH_STYLE_ENDPOINT` | `true`                                 |

---

## 🐛 トラブルシューティング

### image_path: false になる問題

#### 症状

画像アップロード後のAPIレスポンスで `image_path: false` が返される。

#### 原因

Cloudflare R2のAPIトークンの権限が **「オブジェクト読み取り専用」** になっていたため、書き込みが拒否されていた。

`config/filesystems.php` の `'throw' => false` によりエラーが握りつぶされていたため、発見が遅れた。

#### 解決方法

1. Cloudflare Dashboard → R2 →「Manage R2 API Tokens」
2. 該当トークンの権限を **「オブジェクト読み取りと書き込み」** に変更
3. 新しい `AWS_ACCESS_KEY_ID` と `AWS_SECRET_ACCESS_KEY` を `backend/.env` に更新
4. `php artisan config:clear` でキャッシュをクリア

#### 確認方法

```bash
docker compose exec backend php artisan config:clear
docker compose exec backend php artisan tinker
```

tinker内で：

```php
Storage::disk('s3')->put('test.txt', 'hello');
```

`true` が返れば接続成功。

#### デバッグTips

エラーが握りつぶされて原因がわからない場合は `config/filesystems.php` の `s3` ドライバーの `throw` を一時的に `true` に変更するとエラーの詳細が確認できる。確認後は必ず `false` に戻すこと。

---

## 💡 設計上の振り返り

- **疎結合なストレージ設計**: Laravelの `store()` メソッドとFilesystem抽象化を利用することで、保存先をローカル・S3・R2等に `.env` の変更だけで切り替え可能な柔軟性を確保。
- **Laravel 11の特性**: API機能を `install:api` で明示的に追加するプロセスを通じ、フレームワークの軽量化思想を理解。
- **CORSの環境変数化**: `allowed_origins` をハードコーディングから環境変数参照に変更することで、コードを修正せずに開発・本番を切り替えられる設計を実現。
- **認証を見越した設計**: 現時点では `user_name` を `anonymous` で固定しているが、Laravel Sanctumによる認証実装後に実際のユーザー情報へ差し替えられるよう、カラムを先行して追加。

---

## 🚀 デプロイ (Vercel)

本プロジェクトはモノレポ構造（`frontend/` と `backend/` が混在）のため、以下の設定を適用しています。

| 設定項目         | 値                            |
| ---------------- | ----------------------------- |
| Root Directory   | `frontend`                    |
| Framework Preset | Next.js                       |
| Custom Domain    | https://moments.vector-n.net/ |

### 環境変数

| 変数名                            | 用途                               |
| --------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` | Unsplash APIのアクセスキー         |
| `NEXT_PUBLIC_API_URL`             | バックエンドAPIのエンドポイントURL |

---

## 🚀 デプロイ (Railway / Backend)

バックエンド（Laravel + MySQL）はRailwayにデプロイしています。

### 構成

| サービス | 内容                                 |
| -------- | ------------------------------------ |
| Laravel  | GitHubリポジトリと連携し自動デプロイ |
| MySQL    | Railway内のMySQLサービスを使用       |

### Railway用ファイル構成

ローカル開発環境（Docker Compose + Nginxコンテナー分離）とは異なり、Railwayでは1コンテナーにNginx + php-fpmを同梱する構成にしています。

| ファイル                    | 役割                                                            |
| --------------------------- | --------------------------------------------------------------- |
| `backend/Dockerfile`        | Nginx同梱・本番用にリライト（webp対応含む）                     |
| `backend/docker/nginx.conf` | Railway用Nginx設定（`fastcgi_pass` を `127.0.0.1:9000` に変更） |
| `backend/docker/start.sh`   | php-fpm起動 → migrate → storage:link → Nginx起動の順次実行      |

> [!NOTE]
> `backend/docker/nginx/default.conf` はローカル開発用として引き続き使用。Railway用の `nginx.conf` とは別管理。

### 環境変数 (Railway)

| 変数名                        | 用途                                 |
| ----------------------------- | ------------------------------------ |
| `APP_KEY`                     | Laravelアプリケーションキー          |
| `APP_URL`                     | `https://${{RAILWAY_PUBLIC_DOMAIN}}` |
| `DB_HOST`                     | `${{MySQL.MYSQLHOST}}`               |
| `DB_PORT`                     | `${{MySQL.MYSQLPORT}}`               |
| `DB_DATABASE`                 | `${{MySQL.MYSQLDATABASE}}`           |
| `DB_USERNAME`                 | `${{MySQL.MYSQLUSER}}`               |
| `DB_PASSWORD`                 | `${{MySQL.MYSQLPASSWORD}}`           |
| `FRONTEND_URL`                | VercelのデプロイURL（CORS許可用）    |
| `PORT`                        | `80`                                 |
| `FILESYSTEM_DISK`             | `s3`                                 |
| `AWS_ACCESS_KEY_ID`           | R2のAccess Key ID                    |
| `AWS_SECRET_ACCESS_KEY`       | R2のSecret Access Key                |
| `AWS_DEFAULT_REGION`          | `auto`                               |
| `AWS_BUCKET`                  | `moments-images`                     |
| `AWS_URL`                     | R2エンドポイントURL                  |
| `AWS_ENDPOINT`                | R2エンドポイントURL                  |
| `AWS_USE_PATH_STYLE_ENDPOINT` | `true`                               |

---

## 🔗 本番環境の全体構成

```
Vercel（Frontend / Next.js）
    ↓ NEXT_PUBLIC_API_URL
Railway（Backend / Laravel）
    ↓ DB接続
Railway MySQL
    ↓ 画像保存
Cloudflare R2（moments-imagesバケット）
```

---

## 🔜 今後の実装予定

### 優先度：高

- **GET /api/posts**: 投稿一覧を取得するエンドポイントの実装
- **投稿一覧の表示**: 自分の投稿をUnsplashカードUIと同じデザインで表示
- **レート制限**: `throttle:10,1` を `routes/api.php` に追加（同一IPから1分間10回まで）

### 優先度：中

- **CloudflareとRailwayのアラート設定**: 無料枠超過時の通知設定
- **海外アクセス対策**: Cloudflare TurnstileによるCAPTCHAまたは国単位のアクセス制限

### 優先度：低（将来的に）

- **認証（Laravel Sanctum）**: ログイン・ログアウト実装
- **ユーザー情報の紐づけ**: 認証後に `user_name` と `user_avatar_url` を実際のユーザー情報に差し替え
- **Framer Motionによるアニメーション**: カードホバー・モーダル開閉・投稿追加時のフェードインなど、インタラクション強化
