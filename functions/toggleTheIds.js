import { suttaArea } from "../index.js";

export function toggleTheIds() {
  const hideButton = document.getElementById("hide-ids");

  // initial state
  if (localStorage.idsToggle) {
    if (localStorage.idsToggle === "hide") {
      suttaArea.classList.add("hide-ids");
    }
  } else {
    localStorage.idsToggle = "show";
  }

  hideButton.addEventListener("click", () => {
    if (localStorage.idsToggle === "show") {
      suttaArea.classList.add("hide-ids");
      localStorage.idsToggle = "hide";
    } else {
      suttaArea.classList.remove("hide-ids");
      localStorage.idsToggle = "show";
    }
  });
}
