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
        button.innerText = "Sync to GitHub";
        button.disabled = false;
        return;
      }
      const problem = extractProblemFromURL();
      const language = result.language || "txt";
      console.log("Button clicked, problem:", problem, "language:", language);
      console.log("Code length:", result.code.length);

      // Send message and wait for response
      chrome.runtime.sendMessage(
        {
          type: "SYNC_GITHUB",
          payload: {
            code: result.code,
            problem: problem,
            language: language,
          },
        },
        (response) => {
          if (response && response.success) {
            button.innerText = "✓ Synced!";
            button.style.backgroundColor = "#10b981";
            button.style.color = "white";
            setTimeout(() => {
              button.innerText = "Sync to GitHub";
              button.style.backgroundColor = "";
              button.style.color = "";
              button.disabled = false;
            }, 3000);
          } else {
            const errorMsg = response?.message || "Unknown error";
            alert("Sync failed: " + errorMsg);
            button.innerText = "Sync Failed";
            button.style.backgroundColor = "#ef4444";
            button.style.color = "white";
            setTimeout(() => {
              button.innerText = "Sync to GitHub";
              button.style.backgroundColor = "";
              button.style.color = "";
              button.disabled = false;
            }, 3000);
          }
        },
      );
    } catch (error) {
      console.error("Sync error:", error);
      alert("Failed to sync: " + error.message);
      button.innerText = "Sync to GitHub";
      button.disabled = false;
    }
  };
  submitButton.parentNode.appendChild(button);
}

function extractProblemFromURL() {
  const match = window.location.pathname.match(/\/problems\/([^\/]+)/);
  return match ? match[1] : "unknown-problem";
}
