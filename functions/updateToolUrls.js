// const abbreviations = document.querySelectorAll("span.abbr");
// abbreviations.forEach(book => {
//   book.addEventListener("click", e => {
//     citation.value = e.target.innerHTML;
//     citation.focus();
//   });
// });

export function updateToolUrls(uid) {
  const citationHelperLink = document.getElementById("citation-helper");
  const suttaDifferLink = document.getElementById("sutta-differ");
  const scLightLink = document.getElementById("sc-light");
  const scLink = document.getElementById("sc-link");

  citationHelperLink.href = `https://sutta.readingfaithfully.org/?q=${uid}`;
  suttaDifferLink.href = `https://diff.readingfaithfully.org/?one=${uid}`;
  scLightLink.href = `https://sc.readingfaithfully.org/?q=${uid}`;
  scLink.href = `https://suttacentral.net/${uid}`;
}
