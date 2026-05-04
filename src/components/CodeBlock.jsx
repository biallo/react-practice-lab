const tokenPattern =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|<\/?[A-Z][A-Za-z0-9.]*\b|<\/?[a-z][A-Za-z0-9-]*\b|\b(?:import|from|export|const|let|var|function|return|class|extends|static|async|await|if|else|switch|case|default|try|catch|finally|new|this|null|true|false)\b|\b[A-Z][A-Za-z0-9_]*(?=\s*[({<])|\b(?:use[A-Z][A-Za-z0-9_]*|ReactDOM|React|document|window|navigator)\b|\b\d+(?:\.\d+)?\b)/g;

function getTokenClass(token) {
  if (token.startsWith('//') || token.startsWith('/*')) {
    return 'code-token comment';
  }

  if (token.startsWith("'") || token.startsWith('"') || token.startsWith('`')) {
    return 'code-token string';
  }

  if (token.startsWith('<')) {
    return 'code-token tag';
  }

  if (/^\d/.test(token)) {
    return 'code-token number';
  }

  if (
    /^(import|from|export|const|let|var|function|return|class|extends|static|async|await|if|else|switch|case|default|try|catch|finally|new|this|null|true|false)$/.test(
      token
    )
  ) {
    return 'code-token keyword';
  }

  return 'code-token symbol';
}

function highlightCode(code) {
  const tokens = [];
  let lastIndex = 0;

  for (const match of code.matchAll(tokenPattern)) {
    if (match.index > lastIndex) {
      tokens.push(code.slice(lastIndex, match.index));
    }

    tokens.push(
      <span className={getTokenClass(match[0])} key={`${match.index}-${match[0]}`}>
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < code.length) {
    tokens.push(code.slice(lastIndex));
  }

  return tokens;
}

export function CodeBlock({ code }) {
  return (
    <pre className="code-block">
      <code>{highlightCode(code)}</code>
    </pre>
  );
}
