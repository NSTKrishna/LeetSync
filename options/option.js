document.getElementById("save").onclick = () => {
  chrome.storage.local.set({
    token: document.getElementById("token").value,
    owner: document.getElementById("owner").value,
    repo: document.getElementById("repo").value,
    branch: document.getElementById("branch").value || "main"
  });

  alert("Saved!");
};