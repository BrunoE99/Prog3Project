import { useTranslations } from "use-intl";

export function ModalConfirmation({
  message,
  onAccept,
  onCancel,
}: {
  message: string;
  onAccept: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("ModalConfirmation");
  return (
    <div className="fixed">
      <div className="fixed inset-0 bg-black opacity-60 z-4"></div>
      <div className="fixed top-1/3 left-1/3 right-1/3 flex justify-center items-center rounded-lg bg-[#001d3d] shadow-lg z-6 pt-5 pb-5">
        <div className="flex flex-col h-full pt-6 pb-6 gap-5">
          <div>
            <span className="font-semibold text-lg text-wrap">{message}</span>
          </div>
          <div className="flex flex-row justify-between items-center">
            <button
              onClick={onAccept}
              className="rounded-lg shadow-md bg-green-800 p-2 pl-3 pr-3 cursor-pointer"
            >
              {t("confirm")}
            </button>
            <button
              onClick={onCancel}
              className="rounded-lg shadow-md bg-red-800 p-2 pl-3 pr-3 cursor-pointer"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
