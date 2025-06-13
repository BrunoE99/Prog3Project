"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Toast from "../../../../components/toast";

export default function LoginSuccessHandler() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );
  const searchParams = useSearchParams();

  useEffect(() => {
    const meetingStatus = Number(searchParams.get("status"));

    if (meetingStatus === 200) {
      setToastMessage("Meeting succesfully deleted.");
      setToastType("success");
      setShowToast(true);

      const url = new URL(window.location.href);
      url.searchParams.delete("status");
      window.history.replaceState({}, "", url.toString());
    } else if (meetingStatus === 201) {
      setToastMessage("Meeting succesfully created.");
      setToastType("success");
      setShowToast(true);

      const url = new URL(window.location.href);
      url.searchParams.delete("status");
      window.history.replaceState({}, "", url.toString());
    } else {
      setToastMessage("You are not authorized to do this");
      setToastType("error");
      setShowToast(true);

      const url = new URL(window.location.href);
      url.searchParams.delete("status");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  const handleCloseToast = () => {
    setShowToast(false);
  };

  if (!showToast) return null;

  return (
    <Toast
      message={toastMessage}
      type={toastType}
      onClose={handleCloseToast}
      duration={5000}
    />
  );
}
