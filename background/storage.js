async function getConfig() {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      ["token", "owner", "repo", "branch"],
      resolve
    );
  });
}