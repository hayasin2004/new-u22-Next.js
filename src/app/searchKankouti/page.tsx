import React from 'react';
import styles from "./searchKankouti.module.css"
import Image from "next/image";

const SearchKankouti = () => {
    return (
        <div>
            <span className={styles.searchBar}>
                <Image src={"/images/JapanTravelKey.png"} width={430} height={932} alt={"背景画像"}/>
            <div  >
                <div className={styles.display}>
                    <input type={"text"} className={styles.search} placeholder={"観光地検索"}></input>
                    <button type={"submit"} className={styles.searchButton}>検索</button>
                </div>
            </div>
            </span>

        </div>
    );
};

export default SearchKankouti;