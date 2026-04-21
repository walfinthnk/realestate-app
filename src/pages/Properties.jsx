import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './Properties.module.css'

// ダミーの物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'グランドパレス渋谷', rent: 220000, area: '渋谷区', type: '1LDK', floor: '8F', size: 42 },
  { id: 2, name: 'シティハウス新宿', rent: 185000, area: '新宿区', type: '1K', floor: '5F', size: 28 },
  { id: 3, name: 'パークコート目黒', rent: 310000, area: '目黒区', type: '2LDK', floor: '12F', size: 65 },
  { id: 4, name: 'ライオンズマンション池袋', rent: 145000, area: '豊島区', type: '1R', floor: '3F', size: 22 },
  { id: 5, name: 'コスモポリス品川', rent: 280000, area: '品川区', type: '2LDK', floor: '10F', size: 58 },
  { id: 6, name: 'プレミアタワー恵比寿', rent: 390000, area: '渋谷区', type: '3LDK', floor: '15F', size: 85 },
  { id: 7, name: 'サニーコート吉祥寺', rent: 132000, area: '武蔵野市', type: '1K', floor: '2F', size: 26 },
  { id: 8, name: 'メゾン自由が丘', rent: 168000, area: '目黒区', type: '1DK', floor: '4F', size: 35 },
]

export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

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
          <h2 className={styles.sectionTitle}>物件一覧</h2>
          <span className={styles.count}>{DUMMY_PROPERTIES.length} 件</span>
        </div>

        <div className={styles.grid}>
          {DUMMY_PROPERTIES.map((property) => (
            <div key={property.id} className={styles.card}>
              {/* 物件タイプバッジ */}
              <div className={styles.cardHeader}>
                <span className={styles.badge}>{property.type}</span>
                <span className={styles.floor}>{property.floor}</span>
              </div>

              <h3 className={styles.propertyName}>{property.name}</h3>

              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>エリア</span>
                  <span className={styles.detailValue}>{property.area}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>面積</span>
                  <span className={styles.detailValue}>{property.size} m²</span>
                </div>
              </div>

              <div className={styles.rent}>
                <span className={styles.rentLabel}>家賃</span>
                <span className={styles.rentValue}>
                  ¥{property.rent.toLocaleString()}
                  <span className={styles.rentUnit}> / 月</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
