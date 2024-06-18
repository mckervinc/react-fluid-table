import { cn } from "@/lib/utils";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const MobileNav = ({ children }: { children?: React.ReactNode }) => {
  // hooks
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const prev = useRef(pathname);

  // effects
  useEffect(() => {
    if (prev.current !== pathname) {
      setIsOpen(false);
    }

    prev.current = pathname;
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflowY = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <nav
      className={cn(
        "fixed left-0 top-0 z-20 w-full overflow-y-auto bg-[#1b1c1d] px-2.5 py-4 text-[rgba(255,255,255,0.9)] md:hidden",
        isOpen && "h-screen"
      )}
    >
      <div>
        <FontAwesomeIcon
          icon={isOpen ? faTimes : faBars}
          className="cursor-pointer"
          onClick={() => setIsOpen(prev => !prev)}
        />
      </div>
      {!isOpen ? null : <>{children}</>}
    </nav>
  );
};

export default MobileNav;
