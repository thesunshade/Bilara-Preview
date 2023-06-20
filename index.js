const suttaArea = document.getElementById("sutta");
const homeButton = document.getElementById("home-button");
const themeButton = document.getElementById("theme-button");
const copyLinkButton = document.getElementById("copy-link");
const bodyTag = document.querySelector("body");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const INSTRUCTION_TEXT = `<p>Please enter the url from the Bilara app or the url from the GitHub unpublished branch. It will look something like this:</p>
<p><code>https://bilara.suttacentral.net/translation/an3.35_translation-es-maggatr</code></p>
<p>or</p>
<p><code>https://github.com/suttacentral/bilara-data/blob/unpublished/translation/es/maggatr/sutta/an/an3/an3.35_translation-es-maggatr.json</code></p>`;

const welcomeText = `<div class="instructions">
${INSTRUCTION_TEXT}
</div>
`;

// console.log("When there is a citation in the url, you can put &translatorsName at the end and it will grab that translation if it exists");

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

document.onkeyup = function (e) {
  const paliHidden = document.getElementById("sutta").classList.contains("hide-pali");
  if (e.altKey && e.key == "q") {
    bodyTag.style.background = "#42428f";
    window.addBreaks = true;
  } else if (!paliHidden && e.target.id != "citation" && e.key == "s") {
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

// initialize
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

themeButton.addEventListener("click", () => {
  if (localStorage.theme === "light") {
    bodyTag.classList.add("dark");
    localStorage.theme = "dark";
  } else {
    bodyTag.classList.remove("dark");
    localStorage.theme = "light";
  }
});

const form = document.getElementById("form");
const citation = document.getElementById("citation");
citation.focus();

form.addEventListener("submit", e => {
  e.preventDefault();
  if (citation.value) {
    buildSutta(citation.value.replace(/\s/g, ""));
    history.pushState({ page: citation.value.replace(/\s/g, "") }, "", `?q=${citation.value.replace(/\s/g, "")}`);
  }
});

citation.value = document.location.search.replace("?q=", "").replace(/%20/g, "").replace(/\s/g, "");

function findGitHubDirectory(uid) {
  let gitHubUrl = "";
  const VINAYA_BU = ["pli-tv-bu-vb-pj", "pli-tv-bu-vb-ss", "pli-tv-bu-vb-ay", "pli-tv-bu-vb-np", "pli-tv-bu-vb-pc", "pli-tv-bu-vb-pd", "pli-tv-bu-vb-sk", "pli-tv-bu-vb-as"];
  const VINAYA_BI = ["pli-tv-bi-vb-pj", "pli-tv-bi-vb-ss", "pli-tv-bi-vb-np", "pli-tv-bi-vb-pc", "pli-tv-bi-vb-pd", "pli-tv-bi-vb-sk", "pli-tv-bi-vb-as"];
  const VINAYA_BOOKS = ["pli-tv-kd", "pli-tv-pvr"];
  const VINAYA = VINAYA_BOOKS.concat(VINAYA_BU, VINAYA_BI);
  const NIKAYA_SUTTAS = ["dn", "mn"];
  const NIKAYA_CHAPTERS = ["sn", "an"];
  const KN_SUTTAS = ["kp", "dhp", "vv", "pv", "thag", "thig"];
  const KN_CHAPTERS = ["ud", "iti", "snp"];
  const SUTTA_BOOKS = NIKAYA_SUTTAS.concat(NIKAYA_CHAPTERS, KN_SUTTAS, KN_CHAPTERS);
  const KN_CHAPTER_DICTIONARY = {
    "ud1.1": "vagga1",
    "ud1.2": "vagga1",
    "ud1.3": "vagga1",
    "ud1.4": "vagga1",
    "ud1.5": "vagga1",
    "ud1.6": "vagga1",
    "ud1.7": "vagga1",
    "ud1.8": "vagga1",
    "ud1.9": "vagga1",
    "ud1.10": "vagga1",
    "ud2.1": "vagga2",
    "ud2.2": "vagga2",
    "ud2.3": "vagga2",
    "ud2.4": "vagga2",
    "ud2.5": "vagga2",
    "ud2.6": "vagga2",
    "ud2.7": "vagga2",
    "ud2.8": "vagga2",
    "ud2.9": "vagga2",
    "ud2.10": "vagga2",
    "ud3.1": "vagga3",
    "ud3.2": "vagga3",
    "ud3.3": "vagga3",
    "ud3.4": "vagga3",
    "ud3.5": "vagga3",
    "ud3.6": "vagga3",
    "ud3.7": "vagga3",
    "ud3.8": "vagga3",
    "ud3.9": "vagga3",
    "ud3.10": "vagga3",
    "ud4.1": "vagga4",
    "ud4.2": "vagga4",
    "ud4.3": "vagga4",
    "ud4.4": "vagga4",
    "ud4.5": "vagga4",
    "ud4.6": "vagga4",
    "ud4.7": "vagga4",
    "ud4.8": "vagga4",
    "ud4.9": "vagga4",
    "ud4.10": "vagga4",
    "ud5.1": "vagga5",
    "ud5.2": "vagga5",
    "ud5.3": "vagga5",
    "ud5.4": "vagga5",
    "ud5.5": "vagga5",
    "ud5.6": "vagga5",
    "ud5.7": "vagga5",
    "ud5.8": "vagga5",
    "ud5.9": "vagga5",
    "ud5.10": "vagga5",
    "ud6.1": "vagga6",
    "ud6.2": "vagga6",
    "ud6.3": "vagga6",
    "ud6.4": "vagga6",
    "ud6.5": "vagga6",
    "ud6.6": "vagga6",
    "ud6.7": "vagga6",
    "ud6.8": "vagga6",
    "ud6.9": "vagga6",
    "ud6.10": "vagga6",
    "ud7.1": "vagga7",
    "ud7.2": "vagga7",
    "ud7.3": "vagga7",
    "ud7.4": "vagga7",
    "ud7.5": "vagga7",
    "ud7.6": "vagga7",
    "ud7.7": "vagga7",
    "ud7.8": "vagga7",
    "ud7.9": "vagga7",
    "ud7.10": "vagga7",
    "ud8.1": "vagga8",
    "ud8.2": "vagga8",
    "ud8.3": "vagga8",
    "ud8.4": "vagga8",
    "ud8.5": "vagga8",
    "ud8.6": "vagga8",
    "ud8.7": "vagga8",
    "ud8.8": "vagga8",
    "ud8.9": "vagga8",
    "ud8.10": "vagga8",
    iti1: "vagga1",
    iti2: "vagga1",
    iti3: "vagga1",
    iti4: "vagga1",
    iti5: "vagga1",
    iti6: "vagga1",
    iti7: "vagga1",
    iti8: "vagga1",
    iti9: "vagga1",
    iti10: "vagga1",
    iti11: "vagga2",
    iti12: "vagga2",
    iti13: "vagga2",
    iti14: "vagga2",
    iti15: "vagga2",
    iti16: "vagga2",
    iti17: "vagga2",
    iti18: "vagga2",
    iti19: "vagga2",
    iti20: "vagga2",
    iti21: "vagga3",
    iti22: "vagga3",
    iti23: "vagga3",
    iti24: "vagga3",
    iti25: "vagga3",
    iti26: "vagga3",
    iti27: "vagga3",
    iti28: "vagga4",
    iti29: "vagga4",
    iti30: "vagga4",
    iti31: "vagga4",
    iti32: "vagga4",
    iti33: "vagga4",
    iti34: "vagga4",
    iti35: "vagga4",
    iti36: "vagga4",
    iti37: "vagga4",
    iti38: "vagga5",
    iti39: "vagga5",
    iti40: "vagga5",
    iti41: "vagga5",
    iti42: "vagga5",
    iti43: "vagga5",
    iti44: "vagga5",
    iti45: "vagga5",
    iti46: "vagga5",
    iti47: "vagga5",
    iti48: "vagga5",
    iti49: "vagga5",
    iti50: "vagga6",
    iti51: "vagga6",
    iti52: "vagga6",
    iti53: "vagga6",
    iti54: "vagga6",
    iti55: "vagga6",
    iti56: "vagga6",
    iti57: "vagga6",
    iti58: "vagga6",
    iti59: "vagga6",
    iti60: "vagga7",
    iti61: "vagga7",
    iti62: "vagga7",
    iti63: "vagga7",
    iti64: "vagga7",
    iti65: "vagga7",
    iti66: "vagga7",
    iti67: "vagga7",
    iti68: "vagga7",
    iti69: "vagga7",
    iti70: "vagga8",
    iti71: "vagga8",
    iti72: "vagga8",
    iti73: "vagga8",
    iti74: "vagga8",
    iti75: "vagga8",
    iti76: "vagga8",
    iti77: "vagga8",
    iti78: "vagga8",
    iti79: "vagga8",
    iti80: "vagga9",
    iti81: "vagga9",
    iti82: "vagga9",
    iti83: "vagga9",
    iti84: "vagga9",
    iti85: "vagga9",
    iti86: "vagga9",
    iti87: "vagga9",
    iti88: "vagga9",
    iti89: "vagga9",
    iti90: "vagga10",
    iti91: "vagga10",
    iti92: "vagga10",
    iti93: "vagga10",
    iti94: "vagga10",
    iti95: "vagga10",
    iti96: "vagga10",
    iti97: "vagga10",
    iti98: "vagga10",
    iti99: "vagga10",
    iti100: "vagga11",
    iti101: "vagga11",
    iti102: "vagga11",
    iti103: "vagga11",
    iti104: "vagga11",
    iti105: "vagga11",
    iti106: "vagga11",
    iti107: "vagga11",
    iti108: "vagga11",
    iti109: "vagga11",
    iti110: "vagga11",
    iti111: "vagga11",
    iti112: "vagga11",
    "snp1.1": "vagga1",
    "snp1.2": "vagga1",
    "snp1.3": "vagga1",
    "snp1.4": "vagga1",
    "snp1.5": "vagga1",
    "snp1.6": "vagga1",
    "snp1.7": "vagga1",
    "snp1.8": "vagga1",
    "snp1.9": "vagga1",
    "snp1.10": "vagga1",
    "snp1.11": "vagga1",
    "snp1.12": "vagga1",
    "snp2.1": "vagga2",
    "snp2.2": "vagga2",
    "snp2.3": "vagga2",
    "snp2.4": "vagga2",
    "snp2.5": "vagga2",
    "snp2.6": "vagga2",
    "snp2.7": "vagga2",
    "snp2.8": "vagga2",
    "snp2.9": "vagga2",
    "snp2.10": "vagga2",
    "snp2.11": "vagga2",
    "snp2.12": "vagga2",
    "snp2.13": "vagga2",
    "snp2.14": "vagga2",
    "snp3.1": "vagga3",
    "snp3.2": "vagga3",
    "snp3.3": "vagga3",
    "snp3.4": "vagga3",
    "snp3.5": "vagga3",
    "snp3.6": "vagga3",
    "snp3.7": "vagga3",
    "snp3.8": "vagga3",
    "snp3.9": "vagga3",
    "snp3.10": "vagga3",
    "snp3.11": "vagga3",
    "snp3.12": "vagga3",
    "snp4.1": "vagga4",
    "snp4.2": "vagga4",
    "snp4.3": "vagga4",
    "snp4.4": "vagga4",
    "snp4.5": "vagga4",
    "snp4.6": "vagga4",
    "snp4.7": "vagga4",
    "snp4.8": "vagga4",
    "snp4.9": "vagga4",
    "snp4.10": "vagga4",
    "snp4.11": "vagga4",
    "snp4.12": "vagga4",
    "snp4.13": "vagga4",
    "snp4.14": "vagga4",
    "snp4.15": "vagga4",
    "snp4.16": "vagga4",
    "snp5.1": "vagga5",
    "snp5.2": "vagga5",
    "snp5.3": "vagga5",
    "snp5.4": "vagga5",
    "snp5.5": "vagga5",
    "snp5.6": "vagga5",
    "snp5.7": "vagga5",
    "snp5.8": "vagga5",
    "snp5.9": "vagga5",
    "snp5.10": "vagga5",
    "snp5.11": "vagga5",
    "snp5.12": "vagga5",
    "snp5.13": "vagga5",
    "snp5.14": "vagga5",
    "snp5.15": "vagga5",
    "snp5.16": "vagga5",
    "snp5.17": "vagga5",
    "snp5.18": "vagga5",
    "snp5.19": "vagga5",
  };
  // split book citation from number part
  const bookId = uid.match(/^[a-z-]+/)[0];
  const numberId = uid.match(/[0-9.-]+$/)[0];
  console.log(bookId);
  console.log(numberId);

  if (SUTTA_BOOKS.includes(bookId)) {
    gitHubUrl += "sutta";

    if (NIKAYA_SUTTAS.includes(bookId)) {
      gitHubUrl += `/${bookId}`;
      return gitHubUrl;
    } else if (NIKAYA_CHAPTERS.includes(bookId)) {
      const [chapter, sutta] = numberId.split(".");
      gitHubUrl += `/${bookId}/${bookId}${chapter}`;
      return gitHubUrl;
    } else if (KN_CHAPTERS.includes(bookId)) {
      const directory = KN_CHAPTER_DICTIONARY[uid];
      gitHubUrl += `/kn/${bookId}/${directory}`;
      return gitHubUrl;
    } else if (KN_SUTTAS.includes(bookId)) {
      gitHubUrl += `/kn/${bookId}`;
      return gitHubUrl;
    }
  } else if (VINAYA.includes(bookId)) {
    gitHubUrl += "vinaya";

    if (VINAYA_BOOKS.includes(bookId)) {
      return gitHubUrl + `/${bookId}`;
    } else if (VINAYA_BU.includes(bookId)) {
      if (bookId === "pli-tv-bu-vb-as") {
        return gitHubUrl + `/pli-tv-bu-vb/`;
      }
      return gitHubUrl + `/pli-tv-bu-vb/${bookId}`;
    } else if (VINAYA_BI.includes(bookId)) {
      if (bookId === "pli-tv-bi-vb-as") {
        return gitHubUrl + `/pli-tv-bi-vb/`;
      }
      return gitHubUrl + `/pli-tv-bi-vb/${bookId}`;
    }
    return;
  }
}

function buildSutta(slug) {
  let gitHubUrl = "";

  function cleanIds(id) {
    return id.replace(/^[a-z].+?\d+?:/, "");
  }

  if (/bilara\./.test(slug)) {
    // transform bilara slug to githubUrl
    const fileName = slug.match(/translation\/(.+$)/)[1];
    const fileNameSplit = fileName.split(/_/);
    const [uid, fileNameParts] = fileNameSplit;
    const [, languageCode, translatorCode] = fileNameParts.split("-");
    const gitHubDirectory = findGitHubDirectory(uid);
    gitHubUrl = `https://raw.githubusercontent.com/suttacentral/bilara-data/unpublished/translation/${languageCode}/${translatorCode}/${gitHubDirectory}/${fileName}.json`;
  } else {
    gitHubUrl = slug.replace(/%2F/g, "/").replace("https://github.com/suttacentral/bilara-data/blob/unpublished", "https://raw.githubusercontent.com/suttacentral/bilara-data/unpublished");
  }

  const uidArray = gitHubUrl.match(/([a-z0-9.-]+)_translation/);

  if (!uidArray) {
    errorResponse();
  }

  const translationLanguage = gitHubUrl.match(/translation\/([a-z]+)/)[1];
  const uid = uidArray[1];

  let translator = "";

  translator = "sujato";
  slug = slug.toLowerCase();

  if (uid.match(/bu|bi|kd|pvr/)) {
    translator = "brahmali";
  }

  let html = `<div class="button-area">
  <button id="hide-pali" class="hide-button">Toggle Pali</button>
  <button id="hide-english" class="hide-button">Toggle English</button>
  <button id="hide-ids" class="hide-button">Toggle Ids</button>
  </div>`;

  const draftTranslationResponse = fetch(gitHubUrl).then(response => response.json());
  console.log(`https://suttacentral.net/api/bilarasuttas/${uid}/${translator}?lang=en`);
  const contentResponse = fetch(`https://suttacentral.net/api/bilarasuttas/${uid}/${translator}?lang=en`).then(response => response.json());

  const suttaplex = fetch(`https://suttacentral.net/api/suttas/${uid}/${translator}?lang=en&siteLanguage=en`).then(response => response.json());

  Promise.all([draftTranslationResponse, contentResponse, suttaplex])
    .then(responses => {
      const [draftTranslation, contentResponse, suttaplex] = responses;
      console.log(contentResponse);
      const { html_text, translation_text, root_text, keys_order } = contentResponse;

      keys_order.forEach(segment => {
        if (draftTranslation[segment] === undefined) {
          draftTranslation[segment] = "";
        }
        let [openHtml, closeHtml] = html_text[segment].split(/{}/);
        // openHtml = openHtml.replace(/^<span class='verse-line'>/, "<br><span class='verse-line'>");

        if (window.addBreaks === true) {
          openHtml = openHtml.replace(/^<span class='verse-line'>/, "<br><span class='verse-line'>");
        }

        html += `${openHtml}
        <span class="segment" id ="${segment}">
        <span class="pli-lang" lang="pi">${root_text[segment] ? root_text[segment] : ""}</span>
        <span class="eng-lang" lang="en">${translation_text[segment] ? translation_text[segment] : ""}</span>
        <span class="trans-lang" lang="${translationLanguage}"><span class="ids">${cleanIds(segment)} </span>${draftTranslation[segment]}</span>
        </span>${closeHtml}\n\n`;
      });

      suttaArea.innerHTML = html;
      document.title = `${suttaplex.suttaplex.acronym} ${suttaplex.bilara_root_text.title}: ${suttaplex.bilara_translated_text.title}`;

      toggleThePali();
      toggleTheEnglish();
      toggleTheIds();
      updateToolUrls(uid);
    })
    .catch(error => {
      errorResponse();
      console.log(error);
    });
  function errorResponse() {
    suttaArea.innerHTML = `<div class="instructions"><h1>Sorry,</h1><p> <code class="error">${decodeURIComponent(slug)}</code> is not a valid URL or it is somehow not compatible with this previewer app.
      <\p>
      ${INSTRUCTION_TEXT}
      <p>If you have questions or suggestions, please post on the <a href="https://discourse.suttacentral.net/t/translation-previewer-for-bilara-texts/29467">D&D forum</a>.</p>
      </div>`;
  }
}

// initialize the whole app
if (document.location.search) {
  buildSutta(document.location.search.replace("?q=", "").replace(/\s/g, "").replace(/%20/g, ""));
} else {
  suttaArea.innerHTML = welcomeText;
}

function toggleThePali() {
  const hideButton = document.getElementById("hide-pali");

  // initial state
  if (localStorage.paliToggle) {
    if (localStorage.paliToggle === "hide") {
      suttaArea.classList.add("hide-pali");
    }
  } else {
    localStorage.paliToggle = "show";
  }

  hideButton.addEventListener("click", () => {
    if (localStorage.paliToggle === "show") {
      suttaArea.classList.add("hide-pali");
      localStorage.paliToggle = "hide";
      document.querySelector("body").classList.remove("side-by-side");
    } else {
      suttaArea.classList.remove("hide-pali");
      localStorage.paliToggle = "show";
    }
  });
}

function toggleTheEnglish() {
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

function toggleTheIds() {
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

const abbreviations = document.querySelectorAll("span.abbr");
abbreviations.forEach(book => {
  book.addEventListener("click", e => {
    citation.value = e.target.innerHTML;
    // form.input.setSelectionRange(10, 10);
    citation.focus();
  });
});

function updateToolUrls(uid) {
  const citationHelperLink = document.getElementById("citation-helper");
  const suttaDifferLink = document.getElementById("sutta-differ");
  const scLightLink = document.getElementById("sc-light");
  const scLink = document.getElementById("sc-link");

  citationHelperLink.href = `https://sutta.readingfaithfully.org/?q=${uid}`;
  suttaDifferLink.href = `https://diff.readingfaithfully.org/?one=${uid}`;
  scLightLink.href = `https://sc.readingfaithfully.org/?q=${uid}`;
  scLink.href = `https://suttacentral.net/${uid}`;
}
