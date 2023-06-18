import Link from "next/link";
import { FunctionComponent } from "react";

interface iFooterProps {}

const Footer: FunctionComponent<iFooterProps> = () => {
  return (
    <footer className="w-screen text-sm text-center opacity-80 py-8 font-medium">
      {new Date().getFullYear()}© - All Rights Reserved | Created by{" "}
      <a href="https://szalay.me">Balázs Szalay</a> |{" "}
      <Link className="hover:underline" href="releases">
        Release notes
      </Link>
    </footer>
  );
};

export default Footer;
