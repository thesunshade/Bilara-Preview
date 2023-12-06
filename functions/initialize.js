import { bodyTag, INSTRUCTION_TEXT, suttaArea } from "../index.js";
import { buildSutta } from "./buildSutta.js";

export function initialize() {
  const welcomeText = `<div class="instructions">
  ${INSTRUCTION_TEXT}
  </div>
  `;

  if (localStorage.sideBySide) {
    if (localStorage.sideBySide == "true") {
      bodyTag.classList.add("side-by-side");
    }
  } else {
    bodyTag.classList.remove("side-by-side");
  }

  if (localStorage.theme) {
    if (localStorage.theme === "light") {
      bodyTag.classList.remove("dark");
    }
  } else {
    bodyTag.classList.add("dark");
  }

  // initialize the whole app
  if (document.location.search) {
    buildSutta(document.location.search.replace("?q=", "").replace(/\s/g, "").replace(/%20/g, ""));
  } else {
    suttaArea.innerHTML = welcomeText;
  }
}
