# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React + Vite + Supabase で構築した不動産管理 Web アプリ。メールアドレス＋パスワード認証を備え、ログイン後に物件一覧を表示する。

## Git Operations

**コードを変更するたびに GitHub にプッシュすること。**

```bash
git add <変更したファイル>
git commit -m "変更の概要（命令形）"
git push origin main
```

- `git add .` / `git add -A` は使用しない（機密ファイルの誤コミット防止）
- コミットメッセージは命令形で書く（例: "add property listing page"）
- `main` へのforce-push 禁止
- `--no-verify` によるフック回避禁止

## Development Commands

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動（http://localhost:5173）
npm run dev

# 本番ビルド
npm run build

# リント
npm run lint
```

## Environment Variables

`.env` ファイルに以下を設定（`.gitignore` 済みのため Git 管理外）:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Vite では `import.meta.env.VITE_*` でアクセスする。

## Architecture

### 認証フロー

- `src/lib/supabase.js` — Supabase クライアントの初期化（環境変数から接続情報を読み込む）
- `src/contexts/AuthContext.jsx` — `AuthProvider` と `useAuth` フックを提供。`onAuthStateChange` でセッションを監視し、`user` / `loading` / `signIn` / `signUp` / `signOut` をコンテキストで共有する
- `src/components/ProtectedRoute.jsx` — `user` が null のとき `/login` へリダイレクト。`loading` 中は何も描画しない（チラつき防止）

### 画面構成

| パス | コンポーネント | 説明 |
|------|--------------|------|
| `/` | — | `/login` へリダイレクト |
| `/login` | `Login.jsx` | メール・パスワードでログイン |
| `/register` | `Register.jsx` | 新規会員登録 |
| `/properties` | `Properties.jsx` | 物件一覧（要認証） |

### スタイリング

CSS Modules（`*.module.css`）を採用。`Auth.module.css` がログイン・登録画面の共通スタイルを担当。

## デプロイ情報

- 本番URL：https://realestate-app-indol.vercel.app/
- Supabaseプロジェクト名：realestate-app
