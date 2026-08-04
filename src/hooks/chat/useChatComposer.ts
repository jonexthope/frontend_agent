import { useCallback, useRef, useState } from "react";
import { autoResizeTextarea } from "@/utils/chat/textarea";

interface UseChatComposerArgs {
  onSubmitMessage: (message: string) => Promise<void>;
}

export function useChatComposer({ onSubmitMessage }: UseChatComposerArgs) {
  const [value, setValue] = useState("");
  const [liveDataEnabled, setLiveDataEnabled] = useState(false);
  const [analysisEnabled, setAnalysisEnabled] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = useCallback((nextValue: string) => {
    setValue(nextValue);
    autoResizeTextarea(textareaRef.current);
  }, []);

  const clear = useCallback(() => {
    setValue("");
    autoResizeTextarea(textareaRef.current);
  }, []);

  const focus = useCallback(() => textareaRef.current?.focus(), []);

  const submit = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    clear();
    try {
      await onSubmitMessage(trimmed);
    } finally {
      focus();
    }
  }, [clear, focus, onSubmitMessage, value]);

  const onKeyDown = useCallback(
    async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        await submit();
      }
    },
    [submit],
  );

  return {
    value,
    textareaRef,
    liveDataEnabled,
    analysisEnabled,
    setLiveDataEnabled,
    setAnalysisEnabled,
    handleChange,
    onKeyDown,
    submit,
    focus,
    setValue,
  };
}
