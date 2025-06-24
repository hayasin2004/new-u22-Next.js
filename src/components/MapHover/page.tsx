"use client";

import React, {useState} from "react";
import Japan from "@react-map/japan";
import styles from "./style.module.css";
import { prefMap } from "./prefMap";


interface SelectedPref {
  code: string;
  name: string;
}



export default function JapanMap() {
  const [ModalOpen,setModalOpen] = useState(false);
  const [selectedPref, setSelectedPref] = useState<SelectedPref | null>(null);
   const onSelect = (state: string | null) => {
    if (state) {
      const prefName = prefMap[state];
      if (prefName) {
        setSelectedPref({ code: state, name: prefName });
        alert(`${state} が選択されました`);
        setModalOpen(true);
      } else {
        alert(`不明な都道府県コード: ${state}`);
        setModalOpen(true);
      }
    }
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedPref(null);
  };


  return (
      <div>
        <div className={styles.mapWrapper}>
          <Japan type="select-single" onSelect={onSelect}/>
        </div>
        {selectedPref && (
            <div>
              <p><strong>都道府県コード:</strong> {selectedPref.code}</p>
              <p><strong>都道府県名:</strong> {selectedPref.name}</p>
              <p>詳細情報をここに表示できます。🤗🤗🤗🤗🤗🤗🥶🥶👹🐽🐽🐷🐷🐷🐷</p>
            </div>
        )}
      </div>
  );
}
