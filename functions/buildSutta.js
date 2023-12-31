import { findGitHubDirectory } from "./findGitHubDirectory.js";
import { toggleTheEnglish } from "./toggleTheEnglish.js";
import { toggleTheIds } from "./toggleTheIds.js";
import { toggleThePali } from "./toggleThePali.js";
import { suttaArea, INSTRUCTION_TEXT } from "../index.js";
import { updateToolUrls } from "./updateToolUrls.js";

export function buildSutta(slug) {
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
