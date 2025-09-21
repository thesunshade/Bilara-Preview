import { findGitHubDirectory } from "./findGitHubDirectory.js";
import { toggleTheEnglish } from "./toggleTheEnglish.js";
import { toggleTheComments } from "./toggleTheComments.js";
import { toggleTheEnComments } from "./toggleTheEnComments.js";
import { toggleTheIds } from "./toggleTheIds.js";
import { toggleThePali } from "./toggleThePali.js";
import { suttaArea, INSTRUCTION_TEXT } from "../index.js";
import { updateToolUrls } from "./updateToolUrls.js";

export function buildSutta(slug) {
  let gitHubTranslationUrl = "";
  let gitHubCommentsUrl = "";

  function cleanIds(id) {
    return id.replace(/^[a-z].+?\d+?:/, "");
  }

  // The app can accept two types of URLs
  // 1. from the Bilara app
  // 2. from the github repository
  //
  // If the Bilara app link is given, it gets transformed into a GitHub link

  if (/bilara\./.test(slug)) {
    // transform bilara slug to githubUrl

    const fileName = slug.match(/translation\/(.+$)/)[1];
    const fileNameSplit = fileName.split(/_/);
    const [uid, fileNameParts] = fileNameSplit;
    const [, languageCode, translatorCode] = fileNameParts.split("-");
    const gitHubDirectory = findGitHubDirectory(uid);
    gitHubTranslationUrl = `https://raw.githubusercontent.com/suttacentral/bilara-data/unpublished/translation/${languageCode}/${translatorCode}/${gitHubDirectory}/${fileName}.json`;
    const commentFileName = fileName.replace("translation", "comment");
    gitHubCommentsUrl = `https://raw.githubusercontent.com/suttacentral/bilara-data/unpublished/comment/${languageCode}/${translatorCode}/${gitHubDirectory}/${commentFileName}.json`;
  } else {
    gitHubTranslationUrl = slug.replace(/%2F/g, "/").replace("https://github.com/suttacentral/bilara-data/blob/unpublished", "https://raw.githubusercontent.com/suttacentral/bilara-data/unpublished");
    gitHubCommentsUrl = slug.replace(/%2F/g, "/").replace("https://github.com/suttacentral/bilara-data/blob/unpublished", "https://raw.githubusercontent.com/suttacentral/bilara-data/unpublished").replaceAll("translation", "comment");
  }

  const uidArray = gitHubTranslationUrl.match(/([a-z0-9.-]+)_translation/);

  if (!uidArray) {
    errorResponse();
  }

  const translationLanguage = gitHubTranslationUrl.match(/translation\/([a-z]+)/)[1];
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
  <button id="hide-comments" class="hide-button">Toggle Comments</button>
  <button id="hide-en-comments" class="hide-button">Toggle En Comments</button>
  <button id="hide-ids" class="hide-button">Toggle Ids</button>
  </div>`;

  const draftTranslationResponse = fetch(gitHubTranslationUrl).then(response => response.json());
  const draftCommentResponse = fetch(gitHubCommentsUrl)
    .then(response => response.json())
    .catch(error => {});
  const contentResponse = fetch(`https://suttacentral.net/api/bilarasuttas/${uid}/${translator}?lang=en`).then(response => response.json());

  const suttaplex = fetch(`https://suttacentral.net/api/suttas/${uid}/${translator}?lang=en&siteLanguage=en`).then(response => response.json());

  Promise.all([draftTranslationResponse, draftCommentResponse, contentResponse, suttaplex])
    .then(responses => {
      const [draftTranslation, draftCommentResponse, contentResponse, suttaplex] = responses;
      const { html_text, translation_text, root_text, keys_order, comment_text } = contentResponse;
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
        ${draftCommentResponse ? `<span class="comment-text" lang="${translationLanguage}">${draftCommentResponse[segment] ? draftCommentResponse[segment] : ""}</span>` : ""}
        ${comment_text ? `<span class="en-comment-text" lang="en">${comment_text[segment] ? comment_text[segment] : ""}</span>` : ""}
        </span>${closeHtml}\n\n`;
      });

      suttaArea.innerHTML = html;
      document.title = `${suttaplex.suttaplex.acronym} ${suttaplex.bilara_root_text.title}: ${suttaplex.bilara_translated_text.title}`;

      toggleThePali();
      toggleTheEnglish();
      toggleTheIds();
      toggleTheComments();
      toggleTheEnComments();
      updateToolUrls(uid);
    })
    .catch(error => {
      errorResponse();
      console.error(error);
    });
  function errorResponse() {
    suttaArea.innerHTML = `<div class="instructions"><h1>Sorry,</h1><p> <code class="error">${decodeURIComponent(slug)}</code> is not a valid URL or it is somehow not compatible with this previewer app.
      <\p>
      ${INSTRUCTION_TEXT}
      <p>If you have questions or suggestions, please post on the <a href="https://discourse.suttacentral.net/t/translation-previewer-for-bilara-texts/29467">D&D forum</a>.</p>
      </div>`;
  }
}
