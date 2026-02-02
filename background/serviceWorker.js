importScripts("github.js", "storage.js");

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SYNC_GITHUB") {
    syncToGitHub(msg.payload);
  }
});