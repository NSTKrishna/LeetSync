async function syncToGitHub({ code, problem, language }) {
  const { token, owner, repo, branch } = await getConfig();

  if (!token || !owner || !repo) {
    console.error("GitHub config missing");
    return;
  }

  const ext = languageMap[language.toLowerCase()] || "txt";
  const filename = buildFilename(problem, ext);
  const path = `leetcode/${filename}`;

  const api = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  let sha = null;

  const res = await fetch(api, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    const data = await res.json();
    sha = data.sha;
  }

  await fetch(api, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Add solution: ${problem}`,
      content: btoa(unescape(encodeURIComponent(code))),
      branch: branch || "main",
      sha
    })
  });
}
