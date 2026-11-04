import { useEffect, useState, type ReactNode } from "react";
import type { PickerValue } from "../types";
import { injectAppearance, useDocsTheme } from "./docsTheme";

export function DocPage(props: { title: string; lead?: string; children: ReactNode }) {
  return (
    <article className="doc-article">
      <h1>{props.title}</h1>
      {props.lead ? <p className="doc-lead">{props.lead}</p> : null}
      {props.children}
    </article>
  );
}

export function CodeBlock(props: { code: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [props.code]);

  return (
    <div className="doc-code">
      <button
        type="button"
        className="doc-code-copy"
        onClick={() => {
          void navigator.clipboard.writeText(props.code);
          setCopied(true);
        }}
      >
        {copied ? "کپی شد" : "کپی"}
      </button>
      <pre dir="ltr">
        <code>{props.code}</code>
      </pre>
    </div>
  );
}

function shownValue(value: PickerValue): string {
  if (value == null || value === "") return "";
  if (Array.isArray(value) && value.length === 0) return "";
  return JSON.stringify(value);
}

export function Example(props: {
  code: string;
  wide?: boolean;
  initial?: PickerValue;
  /** When false, code block keeps explicit appearance (e.g. theme comparison). */
  useDocsTheme?: boolean;
  children: (value: PickerValue, setValue: (value: PickerValue) => void) => ReactNode;
}) {
  const [value, setValue] = useState<PickerValue>(props.initial ?? null);
  const out = shownValue(value);
  const appearance = useDocsTheme();
  const code =
    props.useDocsTheme === false ? props.code : injectAppearance(props.code, appearance);

  return (
    <div className={`doc-example${props.wide ? " doc-example--wide" : ""}`}>
      <div className="doc-example-preview">{props.children(value, setValue)}</div>
      {out ? (
        <p className="doc-example-value" dir="ltr">
          {out}
        </p>
      ) : null}
      <CodeBlock code={code} />
    </div>
  );
}
