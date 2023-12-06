import { scrollToTopButton } from "./functions/scrollToTopButton.js";
import { initialize } from "./functions/initialize.js";
import { buildSutta } from "./functions/buildSutta.js";

export const suttaArea = document.getElementById("sutta");
const homeButton = document.getElementById("home-button");
const themeButton = document.getElementById("theme-button");
const copyLinkButton = document.getElementById("copy-link");
const form = document.getElementById("form");
const citation = document.getElementById("citation");
export const bodyTag = document.querySelector("body");
export const INSTRUCTION_TEXT = `<p>Please enter the url from the Bilara app or the url from the GitHub unpublished branch. It will look something like this:</p>
<p><code>https://bilara.suttacentral.net/translation/an3.35_translation-es-maggatr</code></p>
<p>or</p>
<p><code>https://github.com/suttacentral/bilara-data/blob/unpublished/translation/es/maggatr/sutta/an/an3/an3.35_translation-es-maggatr.json</code></p>`;

initialize();
scrollToTopButton();
citation.focus();

homeButton.addEventListener("click", () => {
  document.location.search = "";
});

copyLinkButton.addEventListener("click", e => {
  e.preventDefault();
  navigator.clipboard.writeText(window.location.href);
  const copyNoticeArea = document.getElementById("link-copy-notice-area");
  copyNoticeArea.innerHTML = "<div class='link-copy-notice'>Copied!</div>";
  setTimeout(() => {
    copyNoticeArea.innerHTML = "";
  }, 3000);
});

// hotkeys
document.onkeyup = function (e) {
  const paliHidden = document.getElementById("sutta").classList.contains("hide-pali");
  if (!paliHidden && e.target.id != "citation" && e.key == "s") {
    if (localStorage.sideBySide === "true") {
      bodyTag.classList.remove("side-by-side");
      localStorage.sideBySide = "false";
    } else {
      bodyTag.classList.add("side-by-side");
      localStorage.sideBySide = "true";
    }

    //bodyTag.classList.toggle("side-by-side");
  }
};

themeButton.addEventListener("click", () => {
  if (localStorage.theme === "light") {
    bodyTag.classList.add("dark");
    localStorage.theme = "dark";
  } else {
    bodyTag.classList.remove("dark");
    localStorage.theme = "light";
  }
});

form.addEventListener("submit", e => {
  e.preventDefault();
  if (citation.value) {
    buildSutta(citation.value.replace(/\s/g, ""));
    history.pushState({ page: citation.value.replace(/\s/g, "") }, "", `?q=${citation.value.replace(/\s/g, "")}`);
  }
});

citation.value = document.location.search.replace("?q=", "").replace(/%20/g, "").replace(/\s/g, "");
