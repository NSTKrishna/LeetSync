(function () {
  window.addEventListener("message", function (event) {
    if (
      event.source !== window ||
      event.data?.type !== "EXTRACT_CODE_REQUEST"
    ) {
      return;
    }

    let code = null;
    let language = null;

    if (window.monaco && window.monaco.editor) {
      const editors = window.monaco.editor.getEditors?.() || [];
      if (editors.length > 0) {
        code = editors[0].getValue();
        const model = editors[0].getModel();
        if (model) {
          language = model.getLanguageId();
        }
      }
    }

    if (!code) {
      const textarea = document.querySelector("textarea");
      if (textarea) {
        code = textarea.value;
      }
    }

    window.postMessage(
      {
        type: "EXTRACT_CODE_RESPONSE",
        code: code,
        language: language,
      },
      "*",
    );
  });
})();
