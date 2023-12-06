import { KN_CHAPTER_DICTIONARY } from "../data/KN_CHAPTER_DICTIONARY.js";

export function findGitHubDirectory(uid) {
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

  // split book citation from number part
  const bookId = uid.match(/^[a-z-]+/)[0];
  const numberId = uid.match(/[0-9.-]+$/)[0];

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
