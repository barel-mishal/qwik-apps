import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <>
      <header><nav></nav></header>
      <main>
        <Slot />
      </main>
      <aside></aside>
      <footer></footer>
    </>
  );
});
