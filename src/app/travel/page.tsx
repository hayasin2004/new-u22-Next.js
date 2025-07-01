import styles from "./page.module.css"

export default function travelPage() {
    return (
        <main className={styles.main}>
            {/* 背景画像コンテナ */}

            <div className={styles.backgroundContainer}>
            <div className={styles.TopDecorativeLine}></div>
                {/* 左下のテキスト - 3番目に表示 */}
                <div className={styles.leftTextContainer}>
                    <div className={styles.leftText}>人生初めてのひとり旅</div>
                </div>

                {/* 左上 - 1番目に表示 */}
                <div className={styles.centerTextContainer}>
                    <div className={styles.centerText}>Kyoto</div>
                </div>

                <div className={styles.imageTextContainer}>
                    <div>
                        <img className={styles.firstImage} src="images/kyoto1.png" alt="Your Image" />
                    </div>
                    <div>
                        <img className={styles.secondImage} src="images/kyoto2.png" alt="Your Image" />
                    </div>
                     <div>
                        <img className={styles.thirdImage} src="images/kyoto3.png" alt="Your Image" />
                    </div>
                </div>

                {/* 右上のテキスト - 2番目に表示 */}
                <div className={styles.rightTextContainer}>
                    <div className={styles.rightText}>京都に旅行に行ってきました</div>
                </div>
                <div className={styles.BottomDecorativeLine}></div>
            </div>

        </main>
    )
}