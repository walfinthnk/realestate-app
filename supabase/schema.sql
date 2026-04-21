-- =============================================
-- 不動産管理アプリ: テーブル定義 & RLS ポリシー
-- Supabase の SQL Editor に貼り付けて実行する
-- =============================================

-- 物件テーブル
CREATE TABLE properties (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,              -- 物件名
  rent        INTEGER     NOT NULL CHECK (rent > 0), -- 家賃（円）
  area        TEXT        NOT NULL,              -- エリア名
  floor_plan  TEXT        NOT NULL,              -- 間取り（例: 1LDK）
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS を有効化（デフォルトは全行アクセス不可になる）
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- SELECT: 自分が登録した物件のみ取得可能
CREATE POLICY "自分の物件のみ取得可能"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: 認証済みユーザーのみ登録可能。user_id は自分の UID に限定
CREATE POLICY "認証済みユーザーのみ登録可能"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: 自分が登録した物件のみ更新可能
CREATE POLICY "自分の物件のみ更新可能"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: 自分が登録した物件のみ削除可能
CREATE POLICY "自分の物件のみ削除可能"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);
