import { DocPicker, ThemeSelector } from "./docsTheme";
import { PRODUCT_NAME_EN, PRODUCT_NAME_FA } from "./brand";
import { CodeBlock, DocPage, Example } from "./Example";

export function GuidePage(props: { path: string }) {
  if (props.path === "/guide/installation") return <InstallPage />;
  if (props.path === "/guide/examples") return <BasicPage />;
  if (props.path === "/guide/recommend") return <RecommendPage />;
  if (props.path === "/guide") return <IntroPage />;
  return null;
}

function IntroPage() {
  return (
    <DocPage
      title="معرفی"
      lead={`${PRODUCT_NAME_FA} (${PRODUCT_NAME_EN}) یک کامپوننت React و TypeScript است برای انتخاب تاریخ شمسی و میلادی، روی Ant Design.`}
    >
      <ThemeSelector prominent />
      <p>
        اول پوسته را انتخاب کنید. بعد در <a href="#/guide/examples">نمونه‌های پایه</a> و بقیه صفحات، همه
        ورودی‌های زنده با همان ظاهر باز می‌شوند. هر وقت خواستید از نوار بالای صفحه هم می‌توانید عوض کنید.
      </p>
      <p>خروجی پیش‌فرض تاریخ میلادی ISO است و نمایش پیش‌فرض شمسی می‌ماند. نوع انتخاب، زبان و ستون‌های زمان با prop تنظیم می‌شود.</p>
      <ul>
        <li>نُه حالت: تاریخ، تاریخ‌زمان، بازه، بازه با زمان، هفته، چندتایی، ماه، سال، زمان</li>
        <li>تقویم جلالی و میلادی، ارقام فارسی یا لاتین</li>
        <li>پوسته پیش‌فرض، رسمی و تیره</li>
        <li>مودال یا پاپ‌اور در دسکتاپ، شیت در موبایل</li>
        <li>حداقل و حداکثر، روز تعطیل، میانبر بازه، و ترتیب انتخاب سال / ماه / روز</li>
      </ul>
      <p>
        ادامه در <a href="#/guide/installation">نصب</a>. فهرست کامل propها در{" "}
        <a href="#/config">پیکربندی</a> است.
      </p>
    </DocPage>
  );
}

function InstallPage() {
  return (
    <DocPage title="نصب" lead="پکیج جاوااسکریپت، تایپ و استایل را با هم منتشر می‌کند. React و Ant Design در پروژه میزبان می‌مانند.">
      <h2>نصب با npm</h2>
      <CodeBlock code={"npm install noora-datepicker antd"} />
      <p>هم‌نیازها: react و react-dom نسخه ۱۸ به بالا، و antd نسخه ۵ به بالا. استایل Ant Design را یک‌بار در برنامه لود کنید، بعد استایل تقویم:</p>
      <CodeBlock code={'import "antd/dist/reset.css";\nimport "noora-datepicker/styles.css";'} />
      <h2>استفاده</h2>
      <CodeBlock
        code={`import { useState } from "react";
import { PersianDatePicker } from "noora-datepicker";

export function BirthDate() {
  const [value, setValue] = useState(null);

  return (
    <PersianDatePicker
      value={value}
      onChange={setValue}
      placeholder="انتخاب تاریخ"
    />
  );
}`}
      />
      <p>
        کامپوننت‌های آماده: <code>PersianDateTimePicker</code>، <code>PersianRangePicker</code>،{" "}
        <code>PersianTimePicker</code>، <code>PersianMultiplePicker</code> و <code>PersianCalendar</code> برای تقویم بدون ورودی.
      </p>
    </DocPage>
  );
}

function BasicPage() {
  return (
    <DocPage
      title="نمونه‌های پایه"
      lead="هر حالت یک prop است. ظاهر پنل همان پوسته‌ای است که در معرفی یا نوار بالا انتخاب کرده‌اید."
    >
      <Example code={`<PersianDatePicker value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocPicker value={value} onChange={setValue} />}
      </Example>
      <Example
        code={`<PersianDatePicker
  locale="en"
  calendar="gregorian"
  numberSystem="latin"
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocPicker locale="en" calendar="gregorian" numberSystem="latin" value={value} onChange={setValue} />
        )}
      </Example>
      <Example code={`<PersianDatePicker desktopMode="popover" autoConfirm value={value} onChange={setValue} />`}>
        {(value, setValue) => (
          <DocPicker desktopMode="popover" autoConfirm value={value} onChange={setValue} />
        )}
      </Example>
      <Example code={`<PersianDatePicker mode="range" value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocPicker mode="range" value={value} onChange={setValue} />}
      </Example>
      <Example
        initial={[]}
        code={`<PersianDatePicker mode="multiple" value={value} onChange={setValue} />`}
      >
        {(value, setValue) => <DocPicker mode="multiple" value={value} onChange={setValue} />}
      </Example>
      <Example code={`<PersianDatePicker mode="datetime" value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocPicker mode="datetime" value={value} onChange={setValue} />}
      </Example>
      <Example code={`<PersianDatePicker mode="time" timeUnits="hour,minute" value={value} onChange={setValue} />`}>
        {(value, setValue) => (
          <DocPicker mode="time" timeUnits="hour,minute" value={value} onChange={setValue} />
        )}
      </Example>
      <Example code={`<PersianDatePicker mode="month" value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocPicker mode="month" value={value} onChange={setValue} />}
      </Example>
      <Example code={`<PersianDatePicker mode="year" value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocPicker mode="year" value={value} onChange={setValue} />}
      </Example>
    </DocPage>
  );
}

function RecommendPage() {
  return (
    <DocPage
      title="پیکربندی پیشنهادی"
      lead="برای فرم فارسی: نمایش شمسی، خروجی میلادی ISO، تأیید با انتخاب روز، و امکان پاک کردن."
    >
      <Example
        code={`<PersianDatePicker
  locale="fa"
  calendar="jalali"
  numberSystem="persian"
  displayFormat="jYYYY/jMM/jDD"
  valueFormat="YYYY-MM-DD"
  autoConfirm
  allowClear
  showToday
  placeholder="انتخاب تاریخ"
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocPicker
            locale="fa"
            calendar="jalali"
            numberSystem="persian"
            displayFormat="jYYYY/jMM/jDD"
            valueFormat="YYYY-MM-DD"
            autoConfirm
            allowClear
            showToday
            placeholder="انتخاب تاریخ"
            value={value}
            onChange={setValue}
          />
        )}
      </Example>
      <p>اگر خروجی هم باید شمسی باشد، valueFormat را jYYYY/jMM/jDD بگذارید. برای ظاهر فروشگاهی در برنامه خودتان appearance=&quot;official&quot; بگذارید.</p>
    </DocPage>
  );
}
