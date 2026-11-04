import { useMemo, useState, type ReactNode } from "react";
import { Button, Form } from "antd";
import { addDays, addMonths, getToday } from "../calendar/calendar-utils";
import type { PickerValue } from "../types";
import { DocCalendar, DocDateTimePicker, DocPicker, DocRangePicker } from "./docsTheme";
import { CodeBlock, DocPage, Example } from "./Example";

export function ExampleRoute(props: { path: string }) {
  const Page = PAGES[props.path];
  if (!Page) return null;
  return <Page />;
}

const PAGES: Record<string, () => ReactNode> = {
  "/examples/formatting": FormattingPage,
  "/examples/min-max": MinMaxPage,
  "/examples/initial-value": InitialPage,
  "/examples/start-date": StartDatePage,
  "/examples/official": OfficialPage,
  "/examples/popover": PopoverPage,
  "/examples/range": RangePage,
  "/examples/presets": PresetsPage,
  "/examples/multiple": MultiplePage,
  "/examples/week": WeekPage,
  "/examples/editable": EditablePage,
  "/examples/input": InputPage,
  "/examples/auto-confirm": AutoConfirmPage,
  "/examples/theme": ThemePage,
  "/examples/disabling": DisablingPage,
  "/examples/highlight": HighlightPage,
  "/examples/localization": LocalePage,
  "/examples/datetime": DateTimePage,
  "/examples/time": TimePage,
  "/examples/month-year": MonthYearPage,
  "/examples/months": MonthsPage,
  "/examples/mobile": MobilePage,
  "/examples/form": FormPage,
  "/examples/inline": InlinePage,
  "/examples/events": EventsPage,
};

function FormattingPage() {
  return (
    <DocPage
      title="قالب نمایش و خروجی"
      lead="displayFormat متن ورودی است. valueFormat شکلی است که onChange تحویل می‌دهد. پیشوند j یعنی جزء جلالی."
    >
      <p>توکن‌ها: jYYYY jMM jDD jMMMM، و برای میلادی YYYY MM DD MMMM، و برای ساعت HH mm ss.</p>
      <Example
        code={`<PersianDatePicker
  displayFormat="jYYYY/jMM/jDD"
  valueFormat="YYYY-MM-DD"
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocPicker
            displayFormat="jYYYY/jMM/jDD"
            valueFormat="YYYY-MM-DD"
            value={value}
            onChange={setValue}
          />
        )}
      </Example>
      <Example
        code={`<PersianDatePicker
  displayFormat="jDD jMMMM jYYYY"
  valueFormat="jYYYY/jMM/jDD"
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocPicker
            displayFormat="jDD jMMMM jYYYY"
            valueFormat="jYYYY/jMM/jDD"
            value={value}
            onChange={setValue}
          />
        )}
      </Example>
    </DocPage>
  );
}

function MinMaxPage() {
  return (
    <DocPage title="حداقل و حداکثر" lead="روزهای بیرون از بازه قابل انتخاب نیستند.">
      <Example
        code={`<PersianDatePicker
  minDate="1405/08/01"
  maxDate="1405/08/29"
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocPicker minDate="1405/08/01" maxDate="1405/08/29" value={value} onChange={setValue} />
        )}
      </Example>
    </DocPage>
  );
}

function InitialPage() {
  return (
    <DocPage title="مقدار اولیه" lead="defaultValue فقط وقتی value نداده باشید اعمال می‌شود. با value کنترل‌شده، والد صاحب مقدار است.">
      <Example
        initial="2026-10-11"
        code={`<PersianDatePicker defaultValue="2026-10-11" value={value} onChange={setValue} />`}
      >
        {(value, setValue) => (
          <DocPicker defaultValue="2026-10-11" value={value} onChange={setValue} />
        )}
      </Example>
    </DocPage>
  );
}

function StartDatePage() {
  return (
    <DocPage
      title="ترتیب انتخاب"
      lead="startDate مشخص می‌کند کاربر از کدام نما شروع کند. توکن‌ها year و month و day هستند و با ویرگول جدا می‌شوند."
    >
      <Example
        code={`<PersianDatePicker startDate="year,month,day" value={value} onChange={setValue} />`}
      >
        {(value, setValue) => (
          <DocPicker startDate="year,month,day" value={value} onChange={setValue} />
        )}
      </Example>
      <p>اگر فقط یک توکن بدهید، پنل روی همان نما باز می‌شود و بعد از انتخاب برمی‌گردد به روز.</p>
    </DocPage>
  );
}

function OfficialPage() {
  const sampleHolidays = useMemo(
    () => [
      { date: "1405/01/01", title: "نوروز" },
      { date: "1405/01/13", title: "سیزده‌به‌در" },
    ],
    [],
  );

  return (
    <DocPage
      title="پوسته رسمی"
      lead="appearance=&quot;official&quot; ظاهر فروشگاهی با سبز و چیدمان فشرده است. prop holidays همان نقطه تعطیل و title را در این پوسته هم نشان می‌دهد."
    >
      <Example code={`<PersianDatePicker autoConfirm value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocPicker autoConfirm value={value} onChange={setValue} />}
      </Example>
      <Example
        wide
        code={`<PersianDatePicker
  appearance="official"
  holidays={[
    { date: "1405/01/01", title: "نوروز" },
    { date: "1405/01/13", title: "سیزده‌به‌در" },
  ]}
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocPicker holidays={sampleHolidays} value={value} onChange={setValue} />
        )}
      </Example>
      <Example wide code={`<PersianDatePicker mode="range" value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocPicker mode="range" value={value} onChange={setValue} />}
      </Example>
    </DocPage>
  );
}

function PopoverPage() {
  return (
    <DocPage title="پاپ‌اور و مودال" lead="desktopMode پیش‌فرض modal است. popover پنل را به ورودی می‌چسباند.">
      <Example code={`<PersianDatePicker desktopMode="popover" value={value} onChange={setValue} />`}>
        {(value, setValue) => (
          <DocPicker desktopMode="popover" forceVariant="desktop" value={value} onChange={setValue} />
        )}
      </Example>
      <Example code={`<PersianDatePicker desktopMode="modal" value={value} onChange={setValue} />`}>
        {(value, setValue) => (
          <DocPicker desktopMode="modal" forceVariant="desktop" value={value} onChange={setValue} />
        )}
      </Example>
    </DocPage>
  );
}

function RangePage() {
  return (
    <DocPage
      title="بازه"
      lead="مقدار یک آرایه دوتایی است. برای انتخاب نوشته‌شده مثل «این هفته» یا «یک ماه» صفحه میانبر بازه را ببینید."
    >
      <Example code={`<PersianRangePicker value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocRangePicker value={value} onChange={setValue} />}
      </Example>
      <Example
        code={`<PersianDatePicker
  mode="datetimerange"
  timeUnits="hour,minute"
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocPicker mode="datetimerange" timeUnits="hour,minute" value={value} onChange={setValue} />
        )}
      </Example>
    </DocPage>
  );
}

function PresetsPage() {
  const customPresets = useMemo(() => {
    const today = getToday("jalali");
    return [
      { label: "یک هفته", value: () => [addDays(today, -6), today] },
      { label: "یک ماه", value: () => [addMonths(today, -1, "jalali"), today] },
      { label: "سه ماه", value: () => [addMonths(today, -3, "jalali"), today] },
    ];
  }, []);

  return (
    <DocPage
      title="میانبر بازه"
      lead="با showPresets در حالت بازه، کنار تقویم دکمه‌های آماده (امروز، این هفته، این ماه، …) یا لیست دلخواه خودتان می‌آید."
    >
      <h2>میانبرهای آماده</h2>
      <p>برچسب‌ها از locale فارسی می‌آید: امروز، این هفته، هفته گذشته، این ماه، ماه گذشته.</p>
      <Example
        wide
        code={`<PersianRangePicker
  showPresets
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocRangePicker showPresets forceVariant="desktop" value={value} onChange={setValue} />
        )}
      </Example>
      <h2>برچسب دلخواه</h2>
      <p>با presets آرایه‌ای از label و value بسازید. value می‌تواند تابع باشد که بازه را برمی‌گرداند.</p>
      <Example
        wide
        code={`<PersianRangePicker
  showPresets
  presets={[
    { label: "یک هفته", value: () => [start, end] },
    { label: "یک ماه", value: () => [start, end] },
  ]}
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocRangePicker
            showPresets
            presets={customPresets}
            forceVariant="desktop"
            value={value}
            onChange={setValue}
          />
        )}
      </Example>
      <h2>تاریخ تکی</h2>
      <p>در حالت date (نه range) میانبرها امروز، دیروز، فردا و هفته آینده هستند.</p>
      <Example
        code={`<PersianDatePicker showPresets value={value} onChange={setValue} />`}
      >
        {(value, setValue) => (
          <DocPicker showPresets forceVariant="desktop" value={value} onChange={setValue} />
        )}
      </Example>
    </DocPage>
  );
}

function MultiplePage() {
  return (
    <DocPage title="چند تاریخ" lead="هر کلیک یک روز را اضافه یا حذف می‌کند. maxSelections سقف را می‌گذارد.">
      <Example
        initial={[]}
        code={`<PersianDatePicker mode="multiple" maxSelections={5} sortDates value={value} onChange={setValue} />`}
      >
        {(value, setValue) => (
          <DocPicker mode="multiple" maxSelections={5} sortDates value={value} onChange={setValue} />
        )}
      </Example>
    </DocPage>
  );
}

function WeekPage() {
  return (
    <DocPage title="هفته" lead="یک کلیک کل هفته را به شکل بازه انتخاب می‌کند.">
      <Example code={`<PersianDatePicker mode="week" showWeekNumber value={value} onChange={setValue} />`}>
        {(value, setValue) => (
          <DocPicker mode="week" showWeekNumber value={value} onChange={setValue} />
        )}
      </Example>
    </DocPage>
  );
}

function EditablePage() {
  return (
    <DocPage title="ورودی قابل تایپ" lead="با allowInput کاربر می‌تواند تاریخ را بنویسد. اگر متن معتبر نباشد، با خروج از ورودی به مقدار قبلی برمی‌گردد.">
      <Example code={`<PersianDatePicker allowInput placeholder="1405/08/13" value={value} onChange={setValue} />`}>
        {(value, setValue) => (
          <DocPicker allowInput placeholder="1405/08/13" value={value} onChange={setValue} />
        )}
      </Example>
    </DocPage>
  );
}

function InputPage() {
  return (
    <DocPage title="تنظیمات ورودی" lead="اندازه، وضعیت خطا، غیرفعال و پاک کردن همان ورودی Ant Design است.">
      <Example code={`<PersianDatePicker size="large" status="error" allowClear placeholder="الزامی" value={value} onChange={setValue} />`}>
        {(value, setValue) => (
          <DocPicker size="large" status="error" allowClear placeholder="الزامی" value={value} onChange={setValue} />
        )}
      </Example>
      <Example code={`<PersianDatePicker disabled placeholder="غیرفعال" />`}>
        {() => <DocPicker disabled placeholder="غیرفعال" />}
      </Example>
    </DocPage>
  );
}

function AutoConfirmPage() {
  return (
    <DocPage title="تأیید خودکار" lead="autoConfirm بعد از انتخاب روز پنل را می‌بندد و مقدار را ثبت می‌کند. بدون آن، دکمه تأیید لازم است.">
      <Example code={`<PersianDatePicker autoConfirm value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocPicker autoConfirm value={value} onChange={setValue} />}
      </Example>
    </DocPage>
  );
}

function ThemePage() {
  return (
    <DocPage
      title="رنگ و پوسته"
      lead="پوسته کلی را از معرفی یا نوار بالا عوض کنید. اینجا فقط override موضعی primaryColor و appearance=&quot;dark&quot; را می‌بینید."
    >
      <Example code={`<PersianDatePicker primaryColor="#1d7d5e" value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocPicker primaryColor="#1d7d5e" value={value} onChange={setValue} />}
      </Example>
      <Example useDocsTheme={false} code={`<PersianDatePicker appearance="dark" value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocPicker appearance="dark" value={value} onChange={setValue} />}
      </Example>
    </DocPage>
  );
}

function DisablingPage() {
  return (
    <DocPage title="غیرفعال‌سازی" lead="disabledDate برای هر روز یک تابع است. جمعه در تقویم جلالی weekday برابر ۶ است.">
      <Example
        code={`<PersianDatePicker
  disabledDate={(date) => date.weekday === 6}
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocPicker
            disabledDate={(date) => date.weekday === 6}
            value={value}
            onChange={setValue}
          />
        )}
      </Example>
    </DocPage>
  );
}

function HighlightPage() {
  return (
    <DocPage title="تعطیلات" lead="هر مورد date و title دارد. روی روز یک نقطه می‌آید و عنوان در داده روز در دسترس است.">
      <Example
        code={`<PersianDatePicker
  holidays={[
    { date: "1405/01/01", title: "نوروز" },
    { date: "1405/01/13", title: "سیزده‌به‌در" },
  ]}
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocPicker
            holidays={[
              { date: "1405/01/01", title: "نوروز" },
              { date: "1405/01/13", title: "سیزده‌به‌در" },
            ]}
            value={value}
            onChange={setValue}
          />
        )}
      </Example>
    </DocPage>
  );
}

function LocalePage() {
  return (
    <DocPage title="زبان و تقویم" lead="locale زبان را عوض می‌کند و calendar شبکه روزها را. سوییچ فا / EN هر دو را با هم جابه‌جا می‌کند.">
      <Example
        code={`<PersianDatePicker
  locale="en"
  calendar="gregorian"
  numberSystem="latin"
  showCalendarToggle
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocPicker
            locale="en"
            calendar="gregorian"
            numberSystem="latin"
            showCalendarToggle
            value={value}
            onChange={setValue}
          />
        )}
      </Example>
      <Example
        code={`<PersianDatePicker
  monthNames={["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"]}
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocPicker
            monthNames={["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]}
            value={value}
            onChange={setValue}
          />
        )}
      </Example>
    </DocPage>
  );
}

function DateTimePage() {
  return (
    <DocPage
      title="تاریخ و زمان"
      lead="در پوسته رسمی، جابه‌جایی تاریخ و زمان یک سوییچ گرد است. autoSwitchToTime بعد از انتخاب روز به ساعت می‌رود."
    >
      <Example
        code={`<PersianDateTimePicker
  timeUnits="hour,minute"
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocDateTimePicker timeUnits="hour,minute" value={value} onChange={setValue} />
        )}
      </Example>
      <Example
        code={`<PersianDatePicker
  mode="datetime"
  autoSwitchToTime
  timeUnits="hour,minute,second"
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocPicker
            mode="datetime"
            autoSwitchToTime
            timeUnits="hour,minute,second"
            value={value}
            onChange={setValue}
          />
        )}
      </Example>
    </DocPage>
  );
}

function TimePage() {
  return (
    <DocPage title="زمان" lead="timeUnits ستون‌ها را انتخاب می‌کند. minuteStep فاصله دقیقه‌هاست.">
      <Example code={`<PersianDatePicker mode="time" timeUnits="hour,minute" value={value} onChange={setValue} />`}>
        {(value, setValue) => (
          <DocPicker mode="time" timeUnits="hour,minute" value={value} onChange={setValue} />
        )}
      </Example>
      <Example
        code={`<PersianDatePicker
  mode="time"
  timeUnits="hour,minute,second"
  minuteStep={5}
  value={value}
  onChange={setValue}
/>`}
      >
        {(value, setValue) => (
          <DocPicker
            mode="time"
            timeUnits="hour,minute,second"
            minuteStep={5}
            value={value}
            onChange={setValue}
          />
        )}
      </Example>
    </DocPage>
  );
}

function MonthYearPage() {
  return (
    <DocPage title="ماه و سال" lead="mode ماه یا سال، شبکه را مستقیم روی همان واحد باز می‌کند.">
      <Example code={`<PersianDatePicker mode="month" value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocPicker mode="month" value={value} onChange={setValue} />}
      </Example>
      <Example code={`<PersianDatePicker mode="year" value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocPicker mode="year" value={value} onChange={setValue} />}
      </Example>
    </DocPage>
  );
}

function MonthsPage() {
  return (
    <DocPage title="چند ماه" lead="numberOfMonths در نمای دسکتاپ یک تا سه ماه را کنار هم می‌گذارد.">
      <Example wide code={`<PersianDatePicker numberOfMonths={2} forceVariant="desktop" value={value} onChange={setValue} />`}>
        {(value, setValue) => (
          <DocPicker numberOfMonths={2} forceVariant="desktop" value={value} onChange={setValue} />
        )}
      </Example>
    </DocPage>
  );
}

function MobilePage() {
  return (
    <DocPage title="موبایل" lead="زیر mobileBreakpoint پنل به شیت پایین صفحه تبدیل می‌شود. forceVariant این رفتار را قفل می‌کند.">
      <Example code={`<PersianDatePicker forceVariant="mobile" mobileMode="sheet" value={value} onChange={setValue} />`}>
        {(value, setValue) => (
          <DocPicker forceVariant="mobile" mobileMode="sheet" value={value} onChange={setValue} />
        )}
      </Example>
    </DocPage>
  );
}

function FormPage() {
  const [sent, setSent] = useState("");
  return (
    <DocPage title="فرم" lead="Form.Item از Ant Design مقدار را با value و onChange وصل می‌کند.">
      <div className="doc-example">
        <div className="doc-example-preview">
          <Form
            layout="vertical"
            onFinish={(values: { birthDate?: PickerValue }) => setSent(JSON.stringify(values))}
          >
            <Form.Item name="birthDate" label="تاریخ تولد" rules={[{ required: true, message: "تاریخ را انتخاب کنید" }]}>
              <DocPicker />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              ثبت
            </Button>
          </Form>
          {sent ? <p className="doc-example-value" dir="ltr">{sent}</p> : null}
        </div>
        <CodeBlock
          code={`<Form.Item name="birthDate" label="تاریخ تولد" rules={[{ required: true }]}>
              <DocPicker />
</Form.Item>`}
        />
      </div>
    </DocPage>
  );
}

function InlinePage() {
  return (
    <DocPage title="تقویم درون‌خطی" lead="PersianCalendar ورودی ندارد و پنل همیشه دیده می‌شود.">
      <Example wide code={`<PersianCalendar value={value} onChange={setValue} />`}>
        {(value, setValue) => <DocCalendar value={value} onChange={setValue} />}
      </Example>
    </DocPage>
  );
}

function EventsPage() {
  const [log, setLog] = useState<string[]>(["منتظر رویداد"]);
  const push = (line: string) => setLog((prev) => [line, ...prev].slice(0, 6));
  return (
    <DocPage title="رویدادها" lead="onChange مقدار نهایی را می‌دهد. onOpen و onConfirm و onCalendarChange برای بقیه چرخه پنل هستند.">
      <div className="doc-log">{log.join("\n")}</div>
      <Example
        code={`<PersianDatePicker
  showCalendarToggle
  onOpen={() => {}}
  onConfirm={() => {}}
  onChange={(value) => {}}
  onCalendarChange={(calendar) => {}}
/>`}
      >
        {(value, setValue) => (
          <DocPicker
            value={value}
            showCalendarToggle
            onOpen={() => push("open")}
            onConfirm={(next) => push(`confirm ${JSON.stringify(next)}`)}
            onChange={(next) => {
              setValue(next);
              push(`change ${JSON.stringify(next)}`);
            }}
            onCalendarChange={(calendar) => push(`calendar ${calendar}`)}
          />
        )}
      </Example>
    </DocPage>
  );
}
