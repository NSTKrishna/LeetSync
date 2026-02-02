function extractCodeFromPage() {
  return new Promise((resolve, reject) => {
    // Inject the page-context script (CSP-safe)
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("content/pageExtractor.js");
    script.onload = () => {
      script.remove();

      const handler = (event) => {
        if (
          event.source !== window ||
          event.data?.type !== "EXTRACT_CODE_RESPONSE"
        ) {
          return;
        }
        window.removeEventListener("message", handler);
        resolve({
          code: event.data.code,
          language: event.data.language,
          problemSlug: event.data.problemSlug,
        });
      };

      window.addEventListener("message", handler);

      window.postMessage({ type: "EXTRACT_CODE_REQUEST" }, "*");

      setTimeout(() => {
        window.removeEventListener("message", handler);
        reject(new Error("Code extraction timeout"));
      }, 5000);
    };

    script.onerror = () => {
      reject(new Error("Failed to load page extractor script"));
    };

    (document.head || document.documentElement).appendChild(script);
  });
}

function extractProblemTitle() {

  try {
    if (window.__NEXT_DATA__?.query?.slug) {
      return window.__NEXT_DATA__.query.slug;
    }
  } catch (e) {
    console.warn("Could not extract from __NEXT_DATA__", e);
  }

  const match = window.location.pathname.match(/\/problems\/([^\/]+)/);
  return match ? match[1] : "unknown-problem";
}

function detectLanguage() {
  return (
    document.querySelector('button[data-cy="lang-select"]')?.innerText ||
    "javascript"
  );
}
