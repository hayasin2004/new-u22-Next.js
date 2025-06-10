import React from 'react';
import styles from './welcome.module.css'
import Image from "next/image";
const welcomeToJapan = () => {
    return (
        <div className={styles.container}>
            <div className={styles.Hinomarucontainer}>
                <Image
                    src="/images/Hinomaru.png"
                    alt="Hinomaru Logo"
                    width={100}
                    height={100}
                    className={styles.Hinomaru}
                    priority
                />
            </div>
            <h2 className={styles.siteName}>Welcome to <br/>Japan</h2>
            <div className={styles.Hinomarucontainer}>
                <Image
                    src="/images/tunami.png"
                    alt="Hinomaru Logo"
                    width={500}
                    height={500}
                    className={styles.Hinomaru}
                    priority
                />
            </div>
        </div>
    );
};

export default welcomeToJapan;