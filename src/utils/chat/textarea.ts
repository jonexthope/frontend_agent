export function autoResizeTextarea(
  textarea: HTMLTextAreaElement | null,
  maxHeight = 160,
): void {
  if (!textarea) return;
  textarea.style.height = "auto";
  const nextHeight = Math.min(textarea.scrollHeight, maxHeight);
  textarea.style.height = `${nextHeight}px`;
}
