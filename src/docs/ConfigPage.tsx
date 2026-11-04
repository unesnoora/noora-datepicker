import { PROP_DOCS } from "./catalog";
import { DocPage } from "./Example";

export function ConfigPage() {
  const groups: string[] = [];
  for (const prop of PROP_DOCS) {
    if (!groups.includes(prop.group)) groups.push(prop.group);
  }

  return (
    <DocPage title="پیکربندی" lead="همه propهای PersianDatePicker. نام‌ها همان نام‌های TypeScript هستند.">
      {groups.map((group) => (
        <section key={group}>
          <h2>{group}</h2>
          {PROP_DOCS.filter((prop) => prop.group === group).map((prop) => (
            <div className="doc-prop" id={`prop-${prop.name}`} key={prop.name}>
              <h3>{prop.name}</h3>
              <p>{prop.text}</p>
              <ul>
                <li>نوع: <code>{prop.type}</code></li>
                <li>پیش‌فرض: <code>{prop.def}</code></li>
              </ul>
            </div>
          ))}
        </section>
      ))}
    </DocPage>
  );
}
