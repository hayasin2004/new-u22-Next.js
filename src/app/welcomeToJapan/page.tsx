'use client'

import React, {useEffect, useState} from 'react';
import styles from './welcome.module.css'
import Image from "next/image";
const WelcomeToJapan = () => {
    const [loopKey, setLoopKey] = useState(0);
    const jumpingText = (text: string, baseDelay = 0) =>
        text.split("").map((char, i) => {
            const delay = baseDelay + i * 0.2; // 1文字ずつずらして、baseDelayで行の順番制御
            return (
                <span
                    key={i}
                    className={styles.sequentialJump}
                    style={{animationDelay: `${delay}s`}}
                >
        {char === " " ? "\u00A0" : char}
      </span>
            );
        });


        useEffect(() => {
            const interval = setInterval(() => {
                setLoopKey((prev) => prev + 1); // 毎回 key を変えて再描画
            }, 8000); // 4秒ごとに繰り返す（ジャンプ終了後）

            return () => clearInterval(interval);
        }, []);

        return (
            <div className={styles.container}>
                <div>
                    <Image
                        src="/images/Hinomaru.png"
                        alt="Hinomaru Logo"
                        width={450}
                        height={780}
                        className={styles.Hinomaru}
                        priority
                    />
                </div>
                <div>
                    <Image
                        src={"/images/bar.png"}
                        alt={"bar"}
                        width={900}
                        height={1500}
                        className={styles.CenterBar}
                        priority
                    />
                </div>
                <h2 className={styles.Travel}>TRAVEL</h2>
                <h2 className={styles.Key}>KEY</h2>
                <h2 className={styles.Japan}>JAPAN</h2>
                <div key={loopKey}>
                    <h2 className={styles.DiscoverJapan}>{jumpingText("UNLOCK THE", 0)}</h2>
                    <h2 className={styles.DiscoverJapan}>{jumpingText("JOURNEY.", 2)}</h2>
                    <h2 className={styles.DiscoverJapan}>{jumpingText("DISCOVER JAPAN", 4)}</h2>
                </div>
                <div>
                    <Image
                        src={"/images/bar.png"}
                        alt={"bar"}
                        width={450}
                        height={780}
                        className={styles.bar}
                        priority
                    />
                </div>
            </div>
        );
    };

export default WelcomeToJapan;