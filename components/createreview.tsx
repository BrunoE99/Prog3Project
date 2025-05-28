import { createReview } from "@/app/movie/[id]/actions";
import { useActionState, useEffect, useRef } from "react";

export default function CreateReview() {
  const scoreSelected = useRef(false);
  const [state, action, pending] = useActionState(createReview, undefined);

  useEffect(() => {
    const starButtons = document.querySelectorAll("#review-sidebar button");
    starButtons.forEach((button) => {
      button.addEventListener("mouseover", () => {
        const index = button.getAttribute("aria-label");
        if (index) {
          starButtons.forEach((btn) => {
            const btnIndex = btn.getAttribute("aria-label");
            if (
              btnIndex &&
              Number(btnIndex) <= Number(index) &&
              !scoreSelected.current
            ) {
              btn.querySelector("span")?.classList.add("fa-star");
              btn.querySelector("span")?.classList.remove("fa-star-o");
            } else if (
              Number(btnIndex) > Number(index) &&
              !scoreSelected.current
            ) {
              btn.querySelector("span")?.classList.add("fa-star-o");
              btn.querySelector("span")?.classList.remove("fa-star");
            }
          });
        }
      });
    });

    document
      .getElementById("review-score")!
      .addEventListener("mouseleave", () => {
        starButtons.forEach((btn) => {
          if (!scoreSelected.current) {
            btn.querySelector("span")?.classList.add("fa-star-o");
            btn.querySelector("span")?.classList.remove("fa-star");
          }
        });
      });

    starButtons.forEach((button) => {
      button.addEventListener("click", () => {
        scoreSelected.current = true;
        document
          .getElementById("score")!
          .setAttribute("value", button.getAttribute("aria-label")!);
      });
    });
  });

  return (
    <div
      id="review-sidebar"
      className="h-full fixed z-1 top-0 right-0 overflow-x-hidden bg-[#000814] pt-15 w-1/5 "
    >
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <div className="text-2xl p-4 ml-2">The Shawshank Redemtion</div>
      <form
        name="create-review"
        action={action}
        className="flex flex-col h-3/4 p-6 gap-4"
      >
        <div className="flex flex-col gap-2">
          <span className="">Your score</span>
          <div id="review-score" className="flex flex-row gap-2 items-center">
            <button aria-label="1" type="button">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="2" type="button">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="3" type="button">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="4" type="button">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="5" type="button">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="6" type="button">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="7" type="button">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="8" type="button">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="9" type="button">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="10" type="button">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <input className="hidden" name="score" id="score" />
          </div>
        </div>
        <div className="flex flex-col h-3/4">
          <textarea
            required
            name="review-content"
            className="border-2 h-3/4 p-2 text-start rounded-md items-start justify-start"
            placeholder="Write you review here..."
          />
        </div>
        <input
          disabled={pending}
          type="submit"
          name="Submit"
          id="submit-review-button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        />
      </form>
    </div>
  );
}
