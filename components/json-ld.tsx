import type { ReactElement } from "react";

type JsonLdData = Record<string, unknown>;

type JsonLdProps = {
  /** One schema object or an array of them. Falsy entries are ignored. */
  data: JsonLdData | null | undefined | Array<JsonLdData | null | undefined>;
};

/**
 * Renders one or more JSON-LD `<script>` tags. Safe to use inside both server
 * and client components — it only emits static structured-data markup.
 */
export function JsonLd({ data }: JsonLdProps): ReactElement {
  const items = (Array.isArray(data) ? data : [data]).filter(
    (item): item is JsonLdData => Boolean(item)
  );

  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
