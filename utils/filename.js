function buildFilename(problem, ext) {
  return (
    problem
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "") +
    "." +
    ext
  );
}