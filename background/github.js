async function syncToGitHub({ code, problem, language }) {
  try {
    // Step 1: Get GitHub credentials
    const config = await getConfig();
    console.log("Config loaded:", {
      hasToken: !!config.token,
      owner: config.owner || "missing",
      repo: config.repo || "missing",
      branch: config.branch || "main",
    });

    // Step 2: Validate credentials exist
    if (!config.token || !config.owner || !config.repo) {
      console.error("GitHub config incomplete:", {
        hasToken: !!config.token,
        hasOwner: !!config.owner,
        hasRepo: !!config.repo,
      });
      throw new Error(
        "GitHub credentials not configured. Please click the extension icon and enter your GitHub token, owner, and repository name.",
      );
    }

    // Step 3: Build filename and path
    const ext = languageMap[language.toLowerCase()] || "txt";
    const filename = buildFilename(problem, ext);
    const path = `leetcode/${filename}`;
    console.log("Creating file:", filename);

    const api = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
    console.log("GitHub API URL:", api);

    let sha = null;

    // Step 4: Check if file already exists
    const res = await fetch(api, {
      headers: { Authorization: `Bearer ${config.token}` },
    });

    if (res.ok) {
      const data = await res.json();
      sha = data.sha;
      console.log("File exists, will update. SHA:", sha);
    } else if (res.status === 404) {
      console.log("File does not exist, will create new file");
    } else {
      // Handle auth errors
      const error = await res.text();
      console.error("GitHub API error checking file:", error);
      if (res.status === 401) {
        throw new Error("Invalid GitHub token. Please check your credentials.");
      } else if (res.status === 404) {
        throw new Error(
          "Repository not found. Please check owner and repo name.",
        );
      }
    }

    // Step 5: Create or update file
    console.log("Uploading code to GitHub...");
    const updateRes = await fetch(api, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add solution: ${problem}`,
        content: btoa(unescape(encodeURIComponent(code))),
        branch: config.branch || "main",
        sha,
      }),
    });

    if (!updateRes.ok) {
      const error = await updateRes
        .json()
        .catch(() => ({ message: updateRes.statusText }));
      console.error("GitHub API error:", error);

      if (updateRes.status === 401) {
        throw new Error(
          "Invalid GitHub token. Please update your credentials.",
        );
      } else if (updateRes.status === 403) {
        throw new Error("Permission denied. Token needs 'repo' scope.");
      } else if (updateRes.status === 404) {
        throw new Error("Repository not found. Check owner/repo name.");
      } else {
        throw new Error(
          `GitHub API error: ${error.message || updateRes.statusText}`,
        );
      }
    }

    const result = await updateRes.json();
    console.log("✓ Successfully synced to GitHub:", filename);
    console.log("File URL:", result.content?.html_url);

    return { filename, url: result.content?.html_url };
  } catch (error) {
    console.error("Sync to GitHub failed:", error);
    throw error;
  }
}
