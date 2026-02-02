function injectSyncButton() {
  if (document.getElementById("github-sync")) {
    return;
  }

  const submitButton = document.querySelector(
    'span[data-e2e-locator="submission-result"]',
  );
  if (!submitButton || !submitButton.innerText.includes("Accepted")) {
    return;
  }

  const button = document.createElement("button");
  button.id = "github-sync";
  button.innerText = "Sync to GitHub";
  button.style.marginLeft = "12px";
  button.style.padding = "6px 12px";
  button.style.border = "1px solid #000";
  button.style.cursor = "pointer";

  button.onclick = async () => {
    try {
      button.disabled = true;
      button.innerText = "Syncing...";

      const result = await extractCodeFromPage();
      if (!result || !result.code || !result.code.trim()) {
        alert(
          "Failed to extract code. Please make sure the code editor is visible.",
        );
        console.error("Code extraction failed");
        button.innerText = "Sync to GitHub";
        button.disabled = false;
        return;
      }

      const problem = result.problemSlug || extractProblemTitle();
      const language = result.language || detectLanguage();
      console.log("Button clicked, problem:", problem, "language:", language);

      chrome.runtime.sendMessage({
        type: "SYNC_GITHUB",
        payload: {
          code: result.code,
          problem: problem,
          language: language,
        },
      });

      button.innerText = "Synced!";
      setTimeout(() => {
        button.innerText = "Sync to GitHub";
        button.disabled = false;
      }, 2000);
    } catch (error) {
      console.error("Sync error:", error);
      alert("Failed to sync: " + error.message);
      button.innerText = "Sync to GitHub";
      button.disabled = false;
    }
  };

  submitButton.parentNode.appendChild(button);
}
