// The email card's Copy button: copies the address, then says "Copied" for two seconds. Where the
// page can't write to the clipboard, it selects the address instead, so Ctrl+C (or Cmd+C) copies it.
document.querySelectorAll("[data-copy]").forEach((button) => {
  const label = button.querySelector(".label");
  const text = label.textContent;
  let timer;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      label.textContent = "Copied";
      button.classList.add("done");
    } catch {
      const range = document.createRange();
      range.selectNodeContents(button.closest(".email-row").querySelector(".email-address"));
      getSelection().removeAllRanges();
      getSelection().addRange(range);
      label.textContent = "Press Ctrl+C";
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      label.textContent = text;
      button.classList.remove("done");
    }, 2000);
  });
});
