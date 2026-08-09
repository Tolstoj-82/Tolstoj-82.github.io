(function () {
  if (!window.Prism) return;

  Prism.languages.json = {
    property: {
      pattern: /(^|[,{]\s*)"(?:\\.|[^"\\])*"(?=\s*:)/m,
      lookbehind: true,
      greedy: true
    },
    string: { pattern: /"(?:\\.|[^"\\])*"(?!\s*:)/, greedy: true },
    comment: { pattern: /\/\*[\s\S]*?\*\/|\/\/.*/, greedy: true },
    number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    punctuation: /[{}[\],]/,
    operator: /:/,
    boolean: /\b(?:false|true)\b/,
    null: { pattern: /\bnull\b/, alias: "keyword" }
  };

  Prism.languages.shell = {
    comment: /#.*/,
    string: { pattern: /(^|[^\\])(["'])(?:\\.|(?!\2)[^\\\r\n])*\2/, lookbehind: true, greedy: true },
    command: { pattern: /(^|[;&|]\s*)[\w.-]+/m, lookbehind: true, alias: "function" },
    option: { pattern: /(^|\s)-{1,2}[\w-]+/, lookbehind: true, alias: "property" },
    punctuation: /[\\|;&]/
  };

  Prism.languages.makefile = {
    comment: /#.*/,
    target: { pattern: /^[^\s:=]+(?=\s*:)/m, alias: "function" },
    variable: /\$\([^)]+\)|\$\{[^}]+\}/,
    keyword: /^\s*\.(?:PHONY|DEFAULT_GOAL)(?=\s*:)/m,
    operator: /::?=|\+=|\?=|:=|:/,
    punctuation: /[()]/
  };

  Prism.languages.powershell = {
    comment: /#.*/,
    string: { pattern: /(["'])(?:`.|(?!\1)[^`\r\n])*\1/, greedy: true },
    command: { pattern: /(^|[;|]\s*)[\w.-]+/m, lookbehind: true, alias: "function" },
    option: { pattern: /(^|\s)-[\w-]+/, lookbehind: true, alias: "property" },
    variable: /\$[\w:]+/,
    punctuation: /[|;]/
  };

  Prism.highlightAll();
}());
