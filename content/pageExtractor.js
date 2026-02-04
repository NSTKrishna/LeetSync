(function () {
  window.addEventListener("message", (event) => {
    if (
      event.source !== window ||
      event.data?.type !== "EXTRACT_CODE_REQUEST"
    ) return;

    let code = null;
    let language = null;

    if (window.monaco?.editor) {
      const editors = window.monaco.editor.getEditors?.() || [];
      if (editors.length) {
        code = editors[0].getValue();
        language = editors[0].getModel()?.getLanguageId();
      }
    }

    window.postMessage(
      {
        type: "EXTRACT_CODE_RESPONSE",
        code,
        language,
      },
      "*"
    );
  });
})();
