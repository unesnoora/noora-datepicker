import { PersianCalendar } from "../index";
import { PRODUCT_NAME_EN, PRODUCT_NAME_FA } from "./brand";
import { useDocsTheme } from "./docsTheme";

export function HomePage() {
  const appearance = useDocsTheme();

  return (
    <div className="docs-home">
      <div className="docs-calendars">
        <PersianCalendar calendar="gregorian" locale="en" appearance={appearance} showCalendarToggle={false} />
        <PersianCalendar appearance={appearance} showCalendarToggle={false} />
        <PersianCalendar appearance={appearance} showCalendarToggle={false} />
      </div>
      <div className="docs-hero">
        <h1>
          {PRODUCT_NAME_FA} {PRODUCT_NAME_EN}
        </h1>
        <p>انتخابگر تاریخ و زمان جلالی و میلادی برای React</p>
        <a className="docs-cta" href="#/guide">
          شروع سریع
        </a>
      </div>
      <div className="docs-features">
        <section>
          <h2>جلالی | میلادی</h2>
          <p>هر دو تقویم، با زبان فارسی یا انگلیسی و سوییچ فا / EN داخل هدر.</p>
        </section>
        <section>
          <h2>تکی | بازه | چندتایی</h2>
          <p>تاریخ، زمان، تاریخ‌زمان، بازه، هفته، ماه، سال و چند تاریخ.</p>
        </section>
        <section>
          <h2>پیش‌فرض | رسمی | تیره</h2>
          <p>پوسته را در راهنما انتخاب کنید؛ همه نمونه‌ها با همان ظاهر باز می‌شوند.</p>
        </section>
      </div>
    </div>
  );
}
