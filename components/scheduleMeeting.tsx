import { scheduleMeeting } from "@/app/[locale]/group/actions";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

export default function ScheduleMeeting({
  onSubmit,
}: {
  onSubmit: () => void;
}) {
  const t = useTranslations("ScheduleMeeting");
  const wrappedScheduleMeeting = async (_state: any, formData: FormData) => {
    const result = await scheduleMeeting(_state, formData);
    if (result.success) {
      onSubmit();
    }
    return result;
  };

  const [state, action, pending] = useActionState(
    wrappedScheduleMeeting,
    undefined
  );

  return (
    <div
      id="meeting-sidebar"
      className="h-full fixed z-2 top-0 left-0 overflow-x-hidden bg-white dark:bg-[#001d3d] dark:text-white pt-15 md:w-1/2 lg:w-1/5 text-black"
    >
      <div className="text-2xl p-4 ml-2 font-semibold">{t("title")}</div>
      <form
        name="create-meeting"
        action={action}
        className="flex flex-col h-3/4 p-6 gap-6"
      >
        <div className="flex flex-col gap-2">
          <span>{t("date-label")}</span>
          <input
            required
            type="datetime-local"
            name="date"
            id="date"
            className="shadow-sm rounded-sm bg-[#003566]"
          />
        </div>
        <div className="flex flex-col h-3/4">
          <span>{t("link-label")}</span>
          <input
            required
            type="text"
            name="link"
            id="link"
            className="border-2 p-2 text-start rounded-md items-start justify-start placeholder-gray-400"
            placeholder={t("link-placeholder")}
          />
        </div>
        <span
          className={`${
            (state?.status && state.status >= 400) || !state?.success
              ? "block"
              : "hidden"
          } text-red-500 justify-center items-center text-center`}
        >
          {state?.error}
        </span>
        <input
          disabled={pending}
          type="submit"
          name="Submit"
          id="submit-meeting-button"
          className="bg-[#001d3dcf] hover:bg-[#001d3d] dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
        />
      </form>
    </div>
  );
}
