import { ContextType } from "@/types/router";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export const useTitle = (title: string) => {
  const { setTitle } = useOutletContext<ContextType>();

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);
};

export const useSource = (source: string) => {
  const { setSource } = useOutletContext<ContextType>();

  useEffect(() => {
    setSource(source);
  }, [setSource, source]);
};
