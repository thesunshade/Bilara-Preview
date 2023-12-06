import { suttaArea } from "../index.js";

export function toggleTheEnglish() {
  const hideButton = document.getElementById("hide-english");

  // initial state
  if (localStorage.englishToggle) {
    if (localStorage.englishToggle === "hide") {
      suttaArea.classList.add("hide-english");
    }
  } else {
    localStorage.englishToggle = "show";
  }

  hideButton.addEventListener("click", () => {
    if (localStorage.englishToggle === "show") {
      suttaArea.classList.add("hide-english");
      localStorage.englishToggle = "hide";
      document.querySelector("body").classList.remove("side-by-side");
    } else {
      suttaArea.classList.remove("hide-english");
      localStorage.englishToggle = "show";
    }
  });
}
