// Using require() to bypass Next.js static analysis restriction on react-dom/server
import type { ReactElement } from "react";

export function renderToHTML(element: ReactElement): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { renderToStaticMarkup } = require("react-dom/server");
  return renderToStaticMarkup(element);
}
