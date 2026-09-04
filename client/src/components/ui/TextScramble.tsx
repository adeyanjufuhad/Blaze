import React from 'react';
import { useTextScramble } from '../../hooks/useTextScramble';

interface TextScrambleProps {
  text: string;
  triggerOnHover?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  chars?: string;
  speed?: number;
}

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  triggerOnHover = true,
  className = '',
  as: Component = 'span',
  chars,
  speed = 2,
}) => {
  const { displayText, triggerScramble } = useTextScramble(text, {
    chars,
    speed,
  });

  return (
    <Component
      onMouseEnter={triggerOnHover ? triggerScramble : undefined}
      className={`inline-block font-mono sm:font-inherit select-none ${className}`}
    >
      {displayText}
    </Component>
  );
};

export default TextScramble;
