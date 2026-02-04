// Load existing settings on page load
window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["token", "owner", "repo", "branch"], (data) => {
    console.log("Loaded settings:", {
      ...data,
      token: data.token ? "***" : "",
    });
    if (data.token) document.getElementById("token").value = data.token;
    if (data.owner) document.getElementById("owner").value = data.owner;
    if (data.repo) document.getElementById("repo").value = data.repo;
    if (data.branch) document.getElementById("branch").value = data.branch;
  });
});

document.getElementById("save").onclick = () => {
  const config = {
    token: document.getElementById("token").value.trim(),
    owner: document.getElementById("owner").value.trim(),
    repo: document.getElementById("repo").value.trim(),
    branch: document.getElementById("branch").value.trim() || "main",
  };

  if (!config.token || !config.owner || !config.repo) {
    alert("Please fill in all required fields (Token, Owner, and Repo)!");
    return;
  }

  console.log("Saving config:", { ...config, token: "***" });

  chrome.storage.local.set(config, () => {
    // Verify it was saved
    chrome.storage.local.get(["token", "owner", "repo", "branch"], (data) => {
      console.log("Verified saved config:", {
        ...data,
        token: data.token ? "***" : "",
      });
      alert("Settings saved successfully!");
    });
  });
};
