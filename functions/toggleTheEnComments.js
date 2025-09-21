import { suttaArea } from "../index.js";

export function toggleTheEnComments() {
  const hideButton = document.getElementById("hide-en-comments");

  // initial state
  if (localStorage.idsToggle) {
    if (localStorage.enCommentsToggle === "hide") {
      suttaArea.classList.add("hide-en-comments");
    }
  } else {
    localStorage.enCommentsToggle = "show";
  }

  hideButton.addEventListener("click", () => {
    if (localStorage.enCommentsToggle === "show") {
      suttaArea.classList.add("hide-en-comments");
      localStorage.enCommentsToggle = "hide";
    } else {
      suttaArea.classList.remove("hide-en-comments");
      localStorage.enCommentsToggle = "show";
    }
  });
}
