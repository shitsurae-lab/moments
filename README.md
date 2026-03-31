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
- **自動無限スクロール (Infinite Scroll)**:
  - `react-intersection-observer` を活用し、ページ最下部への到達を検知して次ページを自動ロード。
  - 大量データを分割取得（Pagination）することで、初期読み込みの高速化とメモリ節約を両立。
- **URLクエリベースの検索システム**:
  - `useRouter` と `useSearchParams` を組み合わせ、検索ワードをURLパラメーター (`?query=...`) に同期。
  - ブラウザの「戻る・進む」や、検索結果のURL共有（ディープリンク）に対応。
- **検索時のリセットロジック**:
  - 検索クエリの変更を検知し、自動的にページ番号を1にリセットして表示をクリアするクリーンアップ処理を実装。
- **Unsplash API ガイドラインの遵守**:
  - **Attribution (帰属表記)**: 投稿者アバター、名前からUnsplash公式プロフィールへの動的リンクを配置。
  - **リファラル追跡**: すべての外部リンクに `utm_source` パラメーターを付与し、API規約に適合。
  - **画像詳細リンク**: 各カード画像からUnsplashのフルサイズ表示ページへの導線を確保。
- **インタラクティブ・コンポーネント設計**:
  - **状態管理の分離**: `LikeButton` を独立したクライアントコンポーネントとして切り出し、親要素の再レンダリングを抑制する最適化。
  - **SVG制御の最適化**: Tailwind CSSの `fill` と `stroke` を動的に制御し、インタラクションに応じた視覚フィードバック（お気に入り状態の可視化）を実装。

---

## 🚀 Deployment (Vercel)

本プロジェクトはVercelにデプロイされています。リポジトリがモノレポ構造（frontend/ とbackend/ が混在）のため、以下の設定を適用しています。

### 構成設定

- **Root Directory**: `frontend`
  - VercelのProject Settingsにて指定。これによりfrontend/ 内のpackage.jsonがビルド対象となります。
- **Framework Preset**: Next.js
  - next.config.tsに基づき、自動的にビルドが最適化されます。
- **Environment Variables**:
  - NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: Unsplash APIから画像を取得するためのアクセストークン。
- **Custom Domain**: [https://moments.vector-n.net/](https://moments.vector-n.net/)
  - VercelのDomains設定にて独自ドメインを紐付け済み。

### 環境変数 (Environment Variables)

Vercelのプロジェクト設定にて以下の変数を設定する必要があります：

- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`: Unsplash APIのアクセキー

### デプロイの手順

1. Vercelでリポジトリをインポート。
2. `Settings > General` で **Root Directory** を `frontend` に指定。
3. `Settings > Environment Variables` で上記の環境変数を追加。
4. 再デプロイを実行。

---

## 🛠 Backend Implementation (Laravel 11)

画像投稿機能を支えるバックエンド側の実装詳細です。Laravel 11の最小構成からAPI機能を有効化し、画像保存サイクルを構築しました。

### 1. 構造の生成とデータベース設計

投稿データの「入れ物（DB）」と「操作担当（Model/Controller）」を効率的に一括生成しました。

- **使用コマンド**:
  ```bash
  docker compose exec backend php artisan make:model Post -mcr
  ```
- -m: Migration（DB設計図）
- -c: Controller（処理の司令塔）
- -r: Resource（標準的なメソッド枠の作成）
- マイグレーション (database/migrations/xxxx_create_posts_table.php):
  php artisan migrateを実行し、MySQL内に以下のカラムを持つpostsテーブルを作成。
  - image_path: 保存された画像の物理パス（ファイル名含む）
  - caption: 投稿の説明文 (nullable)
  - tags: カラム区切りのタグ情報 (nullable)

### 2. API機能の有効化 (Laravel 11)

Laravel 11の「必要最低限」な初期設計に基づき、API専用の窓口を後付けで有効化しました。

- 使用コマンド

```
docker compose exec backend php artisan install:api

```

- 生成ファイル: routes/api.php
- 役割: Next.js(Frontend)からの外部HTTPリクエストを受け付ける専用エンドポイントの定義。

### 3. 保存ロジックの実装

フロントエンドから届いたバイナリデータを検証し、物理保存およびDB記録を行う一連の流れを実装しました

- コントローラー処理 (app/Http/Controllers/PostController.php):
  storeメソッド内に以下を実装。- Validation: webpを含む画像形式のチェックとファイルサイズ制限（2MB）。- File Storage: $request->file('image')->store('posts', 'public') により、storage/app/public/postsへ自動保存。- DB Insert: 保存成功したパスとメタデータをpostsテーブルに記録。
- モデルの保護解除 (app/Models/Post.php):
  - protected $fillable: セキュリティ対策（Mass Assignment）として、外部からの保存を許可するカラムを明示。

### 4. エンドポイント（URL）の定義

フロントエンドがデータを送信する「住所」を確定させました。

- 設定ファイル (routes/api.php)

```php
use App\Http\Controllers\PostController;
Route::post('/posts', [PostController::class, 'store']);

```

##💡 振り返りメモ

- 疎結合なストレージ設計:
  Laravelのstore() メソッドを利用することで、将来的に保存先をLocalからクラウド（Supabase Storage等）へ切り替える際、アプリケーションコードを書き換えずに設定値（.env）の変更のみで対応可能な柔軟性を確保しました。
- Laravel 11の特性:
  API機能を明示的にinstall:apiで追加するプロセスを通じ、フレームワークの軽量化思想を理解しました。

---

###

## プレビュー

- Frontend: http://localhost:3080
- Backend (API): http://localhost:8000
