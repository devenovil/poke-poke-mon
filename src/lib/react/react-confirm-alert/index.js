import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import "./style.scss";
import { safeDeepGetWithType, safeDeepGet } from "../../json";
import { isFunction } from "../../object";

export function customConfirmAlert(
  title,
  question,
  yesAnswer,
  yesFunc,
  noAnswer,
  noFunc
) {
  title = safeDeepGetWithType(title, [], "Konfirmasi");
  question = safeDeepGet(question, [], "Apakah anda yakin?");
  yesAnswer = safeDeepGetWithType(yesAnswer, [], "Ya, yakin");
  // yesFunc = safeDeepGet(yesFunc, []);
  noAnswer = safeDeepGetWithType(noAnswer, [], "Batal");
  var yesDisplay = "block";
  var noDisplay = "block";
  if (yesAnswer === "gone") yesDisplay = "none";
  if (noAnswer === "gone") noDisplay = "none";

  if (!isFunction(yesFunc)) {
    yesFunc = () => console.log();
  }

  if (!isFunction(noFunc)) {
    noFunc = () => console.log();
  }

  return confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className="react-confirm-alert-body" style={{ zIndex: 1400 }}>
          <h4>{title}</h4>
          {question}
          <div
            className="react-confirm-alert-button-group"
            style={{ justifyContent: "flex-end" }}
          >
            <button
              onClick={() => {
                noFunc();
                onClose();
              }}
              style={{
                backgroundColor: "#fff",
                color: "#4D2C91",
                display: noDisplay
              }}
            >
              {noAnswer}
            </button>
            <button
              onClick={() => {
                yesFunc();
                onClose();
              }}
              style={{ backgroundColor: "#4D2C91", display: yesDisplay }}
            >
              {yesAnswer}
            </button>
          </div>
        </div>
      );
    }
  });
}
