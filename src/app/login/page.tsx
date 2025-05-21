import styles from "./page.module.css"
import Image from "next/image"

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <Image
                        src="/images/JTK.png"
                        alt="Japan Travel Key Logo"
                        width={240}
                        height={240}
                        className={styles.logo}
                        priority
                    />
                </div>

                <div className={styles.exploreContainer}>
                    <p className={styles.getReady}>GET READY TO</p>
                    <h2 className={styles.explore}>EXPLORE</h2>
                    <h2 className={styles.japan}>
                        <span className={styles.flowerIcon}>&#10048;</span> JAPAN{" "}
                        <span className={styles.flowerIcon}>&#10048;</span>
                    </h2>
                </div>

                <button className={styles.signupButton}>SIGN UP</button>
            </div>
        </main>
    )
}
