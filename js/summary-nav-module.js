export function enhanceArticle() {
  document.addEventListener("DOMContentLoaded", function() {
    const articleHeader = document.querySelector('article header');
    if (!articleHeader) {
      console.error("Article header is missing.");
      return;
    }

    const summaryNav = articleHeader.nextElementSibling;
    if (!summaryNav || summaryNav.tagName !== "NAV") {
      console.error("The expected nav element following the article's header is missing.");
      return;
    }

    const summaryTitle = document.createElement("h2");
    const navAriaLabel = summaryNav.getAttribute("aria-label");
    if (!navAriaLabel) {
      console.error("The nav element is missing an aria-label attribute.");
      return;
    }
    summaryTitle.textContent = navAriaLabel;
    summaryNav.appendChild(summaryTitle);

    const summaryList = document.createElement("ol");
    summaryNav.appendChild(summaryList);

    document.querySelectorAll("article section h2").forEach(function(h2) {
      const parentSection = h2.closest('section');
      if (!parentSection || !parentSection.id) {
        console.error("Missing ID for the parent section of: " + h2.textContent);
        return;
      }

      const li = document.createElement("li");
      const a = document.createElement("a");
      a.setAttribute("href", "./#" + parentSection.id);
      a.textContent = h2.textContent;
      li.appendChild(a);
      summaryList.appendChild(li);
    });
  });
}
