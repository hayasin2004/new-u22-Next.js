import React from 'react';
import styles from './welcome.module.css'
import Image from "next/image";
const welcomeToJapan = () => {
    return (
        <div className={styles.container}>
            <div >
                <Image
                    src="/images/Hinomaru.png"
                    alt="Hinomaru Logo"
                    width={450}
                    height={780}
                    className={styles.Hinomaru}
                    priority
                />
            </div>
            <h2 className={styles.TravelKey}>TRAVEL KEY</h2>
            <h2 className={styles.Japan}>JAPAN</h2>
            <h2 className={styles.DiscoverJapan}>UNLOCK THE JOURNEY. DISCOVER JAPAN</h2>
        </div>
    );
};

export default welcomeToJapan;