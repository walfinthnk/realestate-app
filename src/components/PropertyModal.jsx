import { useState, useEffect } from 'react'
import styles from './PropertyModal.module.css'

// 物件の新規登録・編集を行うモーダルフォーム
// editTarget が null のとき新規登録、値があるとき編集モードになる
export default function PropertyModal({ editTarget, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    rent: '',
    area: '',
    floor_plan: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 編集モードのときはフォームに既存データをセット
  useEffect(() => {
    if (editTarget) {
      setForm({
        name: editTarget.name,
        rent: String(editTarget.rent),
        area: editTarget.area,
        floor_plan: editTarget.floor_plan,
      })
    }
  }, [editTarget])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const rent = parseInt(form.rent, 10)
    if (isNaN(rent) || rent <= 0) {
      setError('家賃は正の整数で入力してください')
      return
    }

    setLoading(true)
    const err = await onSave({ ...form, rent })
    if (err) setError(err)
    setLoading(false)
  }

  const isEdit = Boolean(editTarget)

  return (
    // オーバーレイをクリックするとモーダルを閉じる
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? '物件を編集' : '物件を新規登録'}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="閉じる">
            ✕
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">物件名</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="グランドパレス渋谷"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="rent">家賃（円）</label>
            <input
              id="rent"
              name="rent"
              type="number"
              value={form.rent}
              onChange={handleChange}
              placeholder="120000"
              min="1"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="area">エリア</label>
            <input
              id="area"
              name="area"
              type="text"
              value={form.area}
              onChange={handleChange}
              placeholder="渋谷区"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="floor_plan">間取り</label>
            <input
              id="floor_plan"
              name="floor_plan"
              type="text"
              value={form.floor_plan}
              onChange={handleChange}
              placeholder="1LDK"
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className={styles.saveButton} disabled={loading}>
              {loading ? '保存中...' : isEdit ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
