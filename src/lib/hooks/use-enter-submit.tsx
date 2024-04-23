// use-enter-submit.ts
import { useRef, type RefObject } from 'react';

export function useEnterSubmit(
  onSubmit: () => void
): {
  inputRef: RefObject<HTMLTextAreaElement>;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
} {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      onSubmit();
      event.preventDefault();
    }
  };

  return { inputRef, onKeyDown: handleKeyDown };
}