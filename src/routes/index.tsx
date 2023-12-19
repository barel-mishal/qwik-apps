import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  
  return (
    <>
    <div class='text-sky-800'>
      lkj
    </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Noga",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
