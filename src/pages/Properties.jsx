import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import PropertyModal from '../components/PropertyModal'
import styles from './Properties.module.css'

export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  // モーダルの表示制御: null=非表示, 'create'=新規, {物件オブジェクト}=編集
  const [modalTarget, setModalTarget] = useState(null)

  // 削除確認中の物件 ID
  const [deletingId, setDeletingId] = useState(null)

  // ----------------------
  // SELECT: 自分の物件を取得
  // ----------------------
  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setFetchError('')

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setFetchError('物件の取得に失敗しました')
    } else {
      setProperties(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // ----------------------
  // INSERT / UPDATE: モーダルから呼ばれる保存処理
  // onSave はエラーメッセージ文字列を返す（成功時は null）
  // ----------------------
  const handleSave = async (formData) => {
    const isEdit = modalTarget !== 'create'

    if (isEdit) {
      // UPDATE: 対象レコードを更新
      const { error } = await supabase
        .from('properties')
        .update({
          name: formData.name,
          rent: formData.rent,
          area: formData.area,
          floor_plan: formData.floor_plan,
        })
        .eq('id', modalTarget.id)

      if (error) return '更新に失敗しました'
    } else {
      // INSERT: user_id を付与して新規登録
      const { error } = await supabase
        .from('properties')
        .insert({ ...formData, user_id: user.id })

      if (error) return '登録に失敗しました'
    }

    // 成功したらモーダルを閉じてリストを再取得
    setModalTarget(null)
    await fetchProperties()
    return null
  }

  // ----------------------
  // DELETE: 物件を削除
  // ----------------------
  const handleDelete = async (id) => {
    setDeletingId(id)

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      alert('削除に失敗しました')
    } else {
      // 削除成功時はローカルの配列からも除去（再フェッチ不要で即反映）
      setProperties((prev) => prev.filter((p) => p.id !== id))
    }

    setDeletingId(null)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className={styles.page}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.logo}>不動産管理システム</h1>
          <div className={styles.userInfo}>
            <span className={styles.email}>{user?.email}</span>
            <button onClick={handleSignOut} className={styles.signOutButton}>
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        <div className={styles.titleRow}>
          <div className={styles.titleLeft}>
            <h2 className={styles.sectionTitle}>物件一覧</h2>
            {!loading && (
              <span className={styles.count}>{properties.length} 件</span>
            )}
          </div>
          <button
            className={styles.addButton}
            onClick={() => setModalTarget('create')}
          >
            ＋ 新規登録
          </button>
        </div>

        {/* エラー表示 */}
        {fetchError && <p className={styles.fetchError}>{fetchError}</p>}

        {/* ローディング */}
        {loading && <p className={styles.loadingText}>読み込み中...</p>}

        {/* 物件なし */}
        {!loading && !fetchError && properties.length === 0 && (
          <div className={styles.empty}>
            <p>登録された物件はありません。</p>
            <button
              className={styles.addButton}
              onClick={() => setModalTarget('create')}
            >
              最初の物件を登録する
            </button>
          </div>
        )}

        {/* 物件カード一覧 */}
        {!loading && (
          <div className={styles.grid}>
            {properties.map((property) => (
              <div key={property.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.badge}>{property.floor_plan}</span>
                </div>

                <h3 className={styles.propertyName}>{property.name}</h3>

                <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>エリア</span>
                    <span className={styles.detailValue}>{property.area}</span>
                  </div>
                </div>

                <div className={styles.rent}>
                  <span className={styles.rentLabel}>家賃</span>
                  <span className={styles.rentValue}>
                    ¥{property.rent.toLocaleString()}
                    <span className={styles.rentUnit}> / 月</span>
                  </span>
                </div>

                {/* 編集・削除ボタン */}
                <div className={styles.cardActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => setModalTarget(property)}
                  >
                    編集
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(property.id)}
                    disabled={deletingId === property.id}
                  >
                    {deletingId === property.id ? '削除中...' : '削除'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 新規登録 / 編集モーダル */}
      {modalTarget !== null && (
        <PropertyModal
          editTarget={modalTarget === 'create' ? null : modalTarget}
          onSave={handleSave}
          onClose={() => setModalTarget(null)}
        />
      )}
    </div>
  )
}
