import { useState, useRef, useCallback, useEffect } from 'react';

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#________';

interface UseTextScrambleOptions {
  chars?: string;
  speed?: number; // lower is faster
  triggerOnMount?: boolean;
}

export const useTextScramble = (
  text: string,
  options: UseTextScrambleOptions = {}
) => {
  const {
    chars = DEFAULT_CHARS,
    speed = 2,
    triggerOnMount = false,
  } = options;

  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const progressRef = useRef(0);

  const stopScramble = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    setDisplayText(text);
    setIsScrambling(false);
  }, [text]);

  const triggerScramble = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    setIsScrambling(true);
    progressRef.current = 0;
    frameCountRef.current = 0;

    const length = text.length;

    const animate = () => {
      frameCountRef.current++;

      if (frameCountRef.current % speed === 0) {
        progressRef.current += 1;
      }

      const currentProgress = progressRef.current;

      const output = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < currentProgress) {
            return text[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      setDisplayText(output);

      if (currentProgress < length) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        setIsScrambling(false);
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [text, chars, speed]);

  useEffect(() => {
    setDisplayText(text);
    if (triggerOnMount) {
      triggerScramble();
    }
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [text, triggerOnMount, triggerScramble]);

  return {
    displayText,
    isScrambling,
    triggerScramble,
    stopScramble,
  };
};

export default useTextScramble;
