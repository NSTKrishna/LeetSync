importScripts(
  "storage.js",
  "github.js",
  "../utils/languageMap.js",
  "../utils/filename.js",
);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SYNC_GITHUB") {
    syncToGitHub(msg.payload)
      .then((result) => {
        console.log("Successfully synced to GitHub");
        sendResponse({
          success: true,
          message: "Successfully synced to GitHub!",
        });
      })
      .catch((error) => {
        console.error("GitHub sync error:", error);
        sendResponse({ success: false, message: error.message });
      });
    return true; // Keep message channel open for async response
  }
});
