import React from 'react';
import styles from "./searchKankouti.module.css"
import Image from "next/image";

const SearchKankouti = () => {
    return (
        <div>
            <span className={styles.searchBar}>
                <Image src={"/images/JapanTravelKey.png"} width={430} height={932} alt={"背景画像"}/>
            <div>
                <div className={styles.display}>
                    <h1>Timeless Harmony</h1>
                    <h2>nara- japan</h2>
                    <div className={styles.underDisplay}>
                        <Image className={styles.arrow} src={"/images/HEW.png"} width={80} height={80} alt={"背景画像"}/>
                        <button>
                                SHOW AROUND
                        </button>
                    </div>
                </div>
            </div>
            </span>

        </div>
    );
};

export default SearchKankouti;