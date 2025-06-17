"use client";

import React from "react";
import Japan from "@react-map/japan";
import styles from "./style.module.css";
import { prefMap } from "./prefMap";

export default function JapanMap() {
  const onSelect = (state: string | null) => {
    if (state) {
      const prefName = prefMap[state];
      if (prefName) {
        alert(`${state} が選択されました`);
      } else {
        alert(`不明な都道府県コード: ${state}`);
      }
    }
  };

  return (
      <div className={styles.mapWrapper}>
        <Japan type="select-single" onSelect={onSelect} />
      </div>
  );
}
