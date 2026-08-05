import { nextTick, ref } from "vue";
import { autoResizeTextarea } from "@/utils/textarea.js";

export function useChatComposer(onSubmitMessage) {
  const message = ref("");
  const liveDataEnabled = ref(false);
  const analysisEnabled = ref(false);
  const textareaRef = ref(null);

  function handleInput() {
    autoResizeTextarea(textareaRef.value);
  }

  function clear() {
    message.value = "";
    autoResizeTextarea(textareaRef.value);
  }

  function focus() {
    textareaRef.value?.focus();
  }

  async function submit() {
    const question = message.value.trim();
    if (!question) return;
    clear();
    try {
      await onSubmitMessage(question);
    } finally {
      await nextTick();
      focus();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  function toggleLiveData() {
    liveDataEnabled.value = !liveDataEnabled.value;
  }

  function toggleAnalysis() {
    analysisEnabled.value = !analysisEnabled.value;
  }

  return {
    message,
    textareaRef,
    liveDataEnabled,
    analysisEnabled,
    handleInput,
    submit,
    handleKeydown,
    toggleLiveData,
    toggleAnalysis,
    focus,
  };
}
