"use client";

import React from "react";
import Japan from "@react-map/japan";
import styles from "./style.module.css";
import { prefMap } from "./prefMap";

export default function JapanMap() {
  const onSelect = (state: string | null) => {
    if (state) {
      alert(`${prefMap[state]} が選択されました`);
    }
  };

  return (
    <div className={styles.mapWrapper}>
      <Japan type="select-single" onSelect={onSelect} />
    </div>
  );
}
