export function ModalConfirmation({
  message,
  onAccept,
  onCancel,
}: {
  message: string;
  onAccept: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed">
      <div className="fixed inset-0 bg-black opacity-60 z-1"></div>
      <div className="fixed top-1/3 left-1/3 right-1/3 flex justify-center items-center rounded-sm bg-[#001d3d] shadow-lg z-2">
        <div className="flex flex-col h-full pt-6 pb-6 gap-5">
          <div>
            <span className="font-semibold text-lg text-wrap">{message}</span>
          </div>
          <div className="flex flex-row justify-between">
            <button
              onClick={onAccept}
              className="rounded-md shadow-md bg-green-800 pl-1 pr-1 cursor-pointer"
            >
              Yes
            </button>
            <button
              onClick={onCancel}
              className="rounded-md shadow-md bg-red-800 pl-1 pr-1 cursor-pointer"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
