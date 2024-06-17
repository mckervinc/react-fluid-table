import Navigation from "@/components/Navigation";
import { Snippet } from "@/components/Snippet";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const links = (
  <>
    <div className="sticky left-0 top-0 bg-[#1b1c1d] px-4 py-3">
      <code className="whitespace-pre rounded-[0.285714rem] px-[0.2em] text-[1.3em] text-[#50f97a]">
        react-fluid-table
      </code>
    </div>
    <Link to="/" className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white">
      Basic Table
    </Link>
    <Link to="/sort" className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white">
      Sortable Table
    </Link>
    <Link to="/sub" className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white">
      Table w/Subcomponent
    </Link>
    <Link to="/custom" className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white">
      Cell Content
    </Link>
    <Link to="/variable" className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white">
      Variable Row Size
    </Link>
    <Link to="/expanded" className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white">
      Expanded Row Height
    </Link>
    <Link
      to="/controlled"
      className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white"
    >
      Controlled Props
    </Link>
    <Link to="/header" className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white">
      Custom Styling
    </Link>
    <Link to="/scroll" className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white">
      Methods
    </Link>
    <Link to="/heights" className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white">
      Table Heights
    </Link>
    <Link to="/footer" className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white">
      Footer
    </Link>
    <Link to="/frozen" className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white">
      Frozen
    </Link>
    <Link to="/props" className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white">
      Table Props
    </Link>
    <a
      target="_blank"
      href="https://github.com/mckervinc/react-fluid-table"
      className="block px-4 py-3 text-[#ffffffe6] hover:bg-[rgba(255,255,255,.08)] hover:text-white"
    >
      <div className="flex items-center gap-x-2">
        <FontAwesomeIcon icon={faGithubAlt} />
        <span>GitHub</span>
      </div>
    </a>
  </>
);

const Layout = () => {
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  return (
    <div className="h-screen w-screen text-[0.875rem] md:flex">
      {/* Desktop Nav */}
      <div className="h-full w-[260px] overflow-y-auto bg-[#1b1c1d] max-md:hidden [&>*:last]:border-b-0 [&>*]:border-b [&>*]:border-solid [&>*]:border-b-[#2d2e2f]">
        {links}
      </div>
      {/* Mobile Nav */}
      <Navigation>
        <div className="w-full overflow-y-auto bg-[#1b1c1d] [&>*:last]:border-b-0 [&>*]:border-b [&>*]:border-solid [&>*]:border-b-[#2d2e2f]">
          {links}
        </div>
      </Navigation>
      {/* Content */}
      <div className="min-h-screen w-[calc(100%-260px)] overflow-y-auto max-md:mt-[3.3125rem] max-md:w-full">
        {!!title && (
          <div className="sticky top-0 z-10 h-[75px] w-full bg-white p-4 shadow-[0px_4px_5px_0px_rgba(176,176,176,0.75)]">
            <div className="text-[2rem] font-bold">{title}</div>
          </div>
        )}
        <div className="w-full p-4">
          <div className="w-full bg-white p-2.5 shadow-[0_2px_8px_#bbb]">
            <Outlet context={{ title, setTitle, source, setSource }} />
          </div>
        </div>
        {!!source && <Snippet code={source} />}
      </div>
    </div>
  );
};

export default Layout;
