import styles from "./page.module.css"

export default function KyotoPage() {
    return (
        <main className={styles.main}>
            {/* 背景画像コンテナ */}
            <div className={styles.backgroundContainer}>
                {/* 左側のテキスト - 3番目に表示 */}
                <div className={styles.leftTextContainer}>
                    <div className={styles.leftText}>緑に囲まれた静かな空間</div>
                </div>

                {/* 中央のテキスト - 1番目に表示 */}
                <div className={styles.centerTextContainer}>
                    {/* 装飾的な縦線（左） */}
                    <div className={styles.decorativeLine}></div>

                    <div className={styles.centerText}>京都</div>

                    {/* 装飾的な縦線（右） */}
                    <div className={styles.decorativeLine}></div>
                </div>

                {/* 右側のテキスト - 2番目に表示 */}
                <div className={styles.rightTextContainer}>
                    <div className={styles.rightText}>日本有数の観光名所</div>
                </div>
            </div>
        </main>
    )
}
