import React from "react";
import classes from "./style.module.css";
import Image from "next/image";

const KytLoad: React.FC = () => (
  <div className={classes.box}>
    <div className={classes.group}>
      <div className={classes["overlap-group"]}>
        <div className={classes.overlap}>
          <div className={classes["text-wrapper"]}>TIME TO TRAVEL</div>
          <div className={classes.div}>KYOTO - JAPAN</div>
        </div>
        <div className={classes["JAPAN-TRAVEL-KEY"]}>
          JAPAN
          <br />
          TRAVEL KEY
        </div>
        <div className={classes["div-wrapper"]}>
          <div className={classes["text-wrapper-2"]}>SHOW AROUND</div>
        </div>
        <Image
          className={classes.HEX}
          alt="Kyoto travel background"
          src="/images/ScrollKyoto.png"
          width={88} //適切な幅を指定
          height={88} //適切な高さを指定
        />
      </div>
    </div>
  </div>
);

export default KytLoad;
