import React from "react";
import classes from "./style.module.css";

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
        <img className={classes.HEX} alt="Kyoto travel background" src="/images/ScrollKyoto.png" />
      </div>
    </div>
  </div>
);

export default KytLoad;
