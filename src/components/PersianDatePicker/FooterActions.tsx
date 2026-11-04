import type { FooterRenderInfo, LocaleLabels, RenderFooter } from "../../types";

export function FooterActions(props: {
  labels: LocaleLabels;
  confirmText?: string;
  cancelText?: string;
  clearText?: string;
  todayText?: string;
  showToday?: boolean;
  allowClear?: boolean;
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onClear: () => void;
  onToday: () => void;
  renderFooter?: RenderFooter;
}) {
  const info: FooterRenderInfo = {
    onConfirm: props.onConfirm,
    onCancel: props.onCancel,
    onClear: props.onClear,
    onToday: props.onToday,
    labels: props.labels,
    confirmDisabled: Boolean(props.confirmDisabled),
  };

  if (props.renderFooter) {
    return <>{props.renderFooter(info)}</>;
  }

  return (
    <div className="pdp-footer">
      <div className="pdp-footer-left">
        <button type="button" className="pdp-btn pdp-btn--ghost pdp-btn--cancel" onClick={props.onCancel}>
          {props.cancelText ?? props.labels.cancel}
        </button>
        {props.allowClear ? (
          <button type="button" className="pdp-btn pdp-btn--ghost" onClick={props.onClear}>
            {props.clearText ?? props.labels.clear}
          </button>
        ) : null}
      </div>
      <div className="pdp-footer-right">
        {props.showToday ? (
          <button type="button" className="pdp-btn" onClick={props.onToday}>
            {props.todayText ?? props.labels.today}
          </button>
        ) : null}
        <button
          type="button"
          className="pdp-btn pdp-btn--primary"
          onClick={props.onConfirm}
          disabled={props.confirmDisabled}
        >
          {props.confirmText ?? props.labels.confirm}
        </button>
      </div>
    </div>
  );
}
