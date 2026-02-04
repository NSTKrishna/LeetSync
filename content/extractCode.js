function extractCodeFromPage() {
  return new Promise((resolve, reject) => {

    if (!chrome.runtime?.id) {
      reject(new Error("Extension context invalidated. Please refresh the page."));
      return;
    }

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

    const timeoutId = setTimeout(() => {
      window.removeEventListener("message", handler);
      reject(new Error("Code extraction timeout"));
    }, 5000);

    if (window.__PAGE_EXTRACTOR_LOADED__) {
      window.postMessage({ type: "EXTRACT_CODE_REQUEST" }, "*");
      return;
    }

    const script = document.createElement("script");

    try {
      script.src = chrome.runtime.getURL("content/pageExtractor.js");
    } catch (e) {
      clearTimeout(timeoutId);
      window.removeEventListener("message", handler);
      reject(
        new Error("Extension context invalidated. Please refresh the page."),
      );
      return;
    }

    script.onload = () => {
      script.remove();
      window.__PAGE_EXTRACTOR_LOADED__ = true;

      window.postMessage({ type: "EXTRACT_CODE_REQUEST" }, "*");
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      window.removeEventListener("message", handler);
      reject(
        new Error(
          "Failed to load page extractor script. Please refresh the page.",
        ),
      );
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
