import { suttaArea } from "../index.js";

export function toggleTheComments() {
  const hideButton = document.getElementById("hide-comments");

  // initial state
  if (localStorage.idsToggle) {
    if (localStorage.commentsToggle === "hide") {
      suttaArea.classList.add("hide-comments");
    }
  } else {
    localStorage.commentsToggle = "show";
  }

  hideButton.addEventListener("click", () => {
    if (localStorage.commentsToggle === "show") {
      suttaArea.classList.add("hide-comments");
      localStorage.commentsToggle = "hide";
    } else {
      suttaArea.classList.remove("hide-comments");
      localStorage.commentsToggle = "show";
    }
  });
}
