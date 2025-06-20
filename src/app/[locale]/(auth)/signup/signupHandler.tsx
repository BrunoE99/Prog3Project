"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Toast from "../../../../../components/toast";
import { useTranslations } from "next-intl";

export default function SignupSuccessHandler() {
  const t = useTranslations("SignupSuccessHandler");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );
  const searchParams = useSearchParams();

  useEffect(() => {
    const signupStatus = searchParams.get("signup");

    if (signupStatus === "success") {
      setToastMessage(t("message"));
      setToastType("success");
      setShowToast(true);

      const url = new URL(window.location.href);
      url.searchParams.delete("signup");
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
