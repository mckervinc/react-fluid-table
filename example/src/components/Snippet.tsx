import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { faReact } from "@fortawesome/free-brands-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import okaidia from "react-syntax-highlighter/dist/esm/styles/prism/okaidia";
import { copy } from "../util";

SyntaxHighlighter.registerLanguage("tsx", tsx);

interface SnippetProps {
  code: string;
  copy?: boolean;
  edit?: boolean;
}

const Snippet = ({ code, copy: showCopy = true, edit = false }: SnippetProps) => {
  const ref = useRef(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      window.clearTimeout(ref.current);
      copy(code);
      ref.current = window.setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  }, [open]);

  return (
    <div className="relative text-[0.85714286em]">
      <div className="absolute right-3.5 top-3.5 my-4 flex border border-solid border-[rgba(34,36,38,.15)] bg-transparent text-base text-[rgba(255,255,255,0.7)] shadow-[0_1px_2px_0_rgba(34,36,38,.15)]">
        {!showCopy ? null : (
          <>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="flex cursor-pointer items-center gap-x-1 px-2 hover:text-[#f8f8f3]">
                  <FontAwesomeIcon icon={faCopy} />
                  <span>Copy</span>
                </div>
              </PopoverTrigger>
              <PopoverContent>copied to clipboard</PopoverContent>
            </Popover>
          </>
        )}
        {!edit ? null : (
          <a className="flex cursor-pointer items-center gap-x-1 px-2 hover:text-[#f8f8f3]">
            <FontAwesomeIcon icon={faReact} />
            <span>Edit</span>
          </a>
        )}
      </div>
      <SyntaxHighlighter language="tsx" style={okaidia} className="!mb-0 !rounded-none">
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

export { Snippet };
