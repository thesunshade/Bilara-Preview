const suttaArea = document.getElementById("sutta");
const homeButton = document.getElementById("home-button");
const themeButton = document.getElementById("theme-button");
const bodyTag = document.querySelector("body");
const previous = document.getElementById("previous");
const next = document.getElementById("next");

const welcomeText = `<div class="instructions">
<p>The complete URL must be for your draft translation on the official unpublished repository on <code>/suttacentral/bilara-data/</code>.</p>
<p>It will look something like this:</p>
<p><code>https://github.com/suttacentral/bilara-data/blob/unpublished/translation/es/maggatr/sutta/an/an3/an3.35_translation-es-maggatr.json<code></p>
</div>
`;

// console.log("When there is a citation in the url, you can put &translatorsName at the end and it will grab that translation if it exists");

homeButton.addEventListener("click", () => {
  document.location.search = "";
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

function buildSutta(slug) {
  function cleanIds(id) {
    return id.replace(/^[a-z].+?\d+?:/, "");
  }

  const githubUrl = slug.replace(/%2F/g, "/").replace("https://github.com/suttacentral/bilara-data/blob/unpublished", "https://raw.githubusercontent.com/suttacentral/bilara-data/unpublished");
  const uidArray = githubUrl.match(/([a-z0-9.]+)_translation/);

  if (!uidArray) {
    errorResponse();
  }

  const uid = uidArray[1];

  let translator = "";
  // let slugArray = slug.split("&");
  // slug = slugArray[0];
  // if (slugArray[1]) {
  //   translator = slugArray[1];
  // } else {
  //   translator = "sujato";
  // }
  translator = "sujato";
  slug = slug.toLowerCase();

  if (uid.match(/bu|bi|kd|pvr/)) {
    translator = "brahmali";
    uid = slug.replace(/bu([psan])/, "bu-$1");
    slug = slug.replace(/bi([psn])/, "bi-$1");
    if (!slug.match("pli-tv-")) {
      slug = "pli-tv-" + slug;
    }
    if (!slug.match("vb-")) {
      slug = slug.replace("bu-", "bu-vb-");
    }
    if (!slug.match("vb-")) {
      slug = slug.replace("bi-", "bi-vb-");
    }
  }

  let html = `<div class="button-area">
  <button id="hide-pali" class="hide-button">Toggle Pali</button>
  <button id="hide-english" class="hide-button">Toggle English</button>
  <button id="hide-ids" class="hide-button">Toggle Ids</button>
  </div>`;

  const draftTranslationResponse = fetch(githubUrl).then(response => response.json());

  const contentResponse = fetch(`https://suttacentral.net/api/bilarasuttas/${uid}/${translator}?lang=en`).then(response => response.json());

  const suttaplex = fetch(`https://suttacentral.net/api/suttas/${uid}/${translator}?lang=en&siteLanguage=en`).then(response => response.json());

  Promise.all([draftTranslationResponse, contentResponse, suttaplex])
    .then(responses => {
      const [draftTranslation, contentResponse, suttaplex] = responses;
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
        <span class="eng-lang" lang="en">${translation_text[segment]}</span>
        <span class="trans-lang" lang="en"><span class="ids">${cleanIds(segment)}</span>${draftTranslation[segment]}</span>
        </span>${closeHtml}\n\n`;
      });
      const scLink = `<p class="sc-link"><a href="https://suttacentral.net/${uid}">On SuttaCentral.net</a></p>`;

      suttaArea.innerHTML = scLink + html;
      document.title = `${suttaplex.suttaplex.acronym} ${suttaplex.bilara_root_text.title}: ${suttaplex.bilara_translated_text.title}`;

      toggleThePali();
      toggleTheEnglish();
      toggleTheIds();
    })
    .catch(error => {
      errorResponse();
    });
  function errorResponse() {
    suttaArea.innerHTML = `<p>Sorry, <code>${decodeURIComponent(slug)}</code> is not a valid GitHub URL.
      <\p>
      <p>You want to use the URL for the page in unpublished branch of the translation you want to view. It will look something like this:</p>
      <code>https://github.com/suttacentral/bilara-data/blob/unpublished/translation/es/maggatr/sutta/an/an3/an3.35_translation-es-maggatr.json<code>
      `;
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
