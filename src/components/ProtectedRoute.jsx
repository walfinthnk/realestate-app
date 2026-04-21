import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 未ログインのユーザーをログイン画面へリダイレクトする保護ルート
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // セッション確認中は何も表示しない（チラつき防止）
  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  return children
}
