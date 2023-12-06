export function scrollToTopButton() {
  var lastScrollTop = 0;
  var isFadingIn = false;

  const buttonHTML = '<button id="scroll-to-top-button">' + '<svg width="24" height="24"><path  style="fill: none;" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="m8 12 4-4m0 0 4 4m-4-4v8M5.4 3h13.2A2.4 2.4 0 0 1 21 5.4v13.2a2.4 2.4 0 0 1-2.4 2.4H5.4A2.4 2.4 0 0 1 3 18.6V5.4A2.4 2.4 0 0 1 5.4 3Z" /></svg>' + "</button>";

  const style = `
      display: none;
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #562d0a;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 10px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.5s ease;
      `;

  // Append the button HTML to the end of the body
  document.body.insertAdjacentHTML("beforeend", buttonHTML);

  const scrollToTopBtn = document.getElementById("scroll-to-top-button");

  scrollToTopBtn.style.cssText = style;

  // Function to check if the user has scrolled approximately one screen
  function isOneScreenScrolled() {
    return window.scrollY > window.innerHeight * 0.5; // Adjust the threshold as needed
  }

  // Function to handle scroll events
  function handleScroll() {
    var st = window.scrollY;

    if (st > lastScrollTop && isOneScreenScrolled() && !isFadingIn) {
      // Scrolling down and past one screen
      fadeIn(scrollToTopBtn);
    } else if (st <= lastScrollTop || !isOneScreenScrolled()) {
      // Scrolling up or not past one screen
      fadeOut(scrollToTopBtn);
    }

    lastScrollTop = st;
  }

  // Function to fade in an element
  function fadeIn(element) {
    isFadingIn = true;
    element.style.display = "block";
    element.style.opacity = 0;

    setTimeout(function () {
      element.style.opacity = 0.8;
      isFadingIn = false;
    }, 0);
  }

  // Function to fade out an element
  function fadeOut(element) {
    element.style.opacity = 0;
    setTimeout(function () {
      element.style.display = "none";
    }, 500); // Adjust the duration of the fade-out transition
  }

  // Event listener for scroll events
  window.addEventListener("scroll", handleScroll);

  // Event listener for button click (for testing purposes)
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
