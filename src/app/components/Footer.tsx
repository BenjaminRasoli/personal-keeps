"use client";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <div className="z-40 bg-background text-center gap-5 flex flex-col justify-center items-center w-full py-10 border-t border-muted">
      <ul className="flex justify-center gap-5">
        <li className="text-primary hover:text-secondary cursor-pointer">
          <Link target="_blank" href={"https://github.com/BenjaminRasoli"}>
            <FaGithub size={30} />
          </Link>
        </li>
        <li className="text-primary hover:text-secondary cursor-pointer">
          <Link
            target="_blank"
            href={"https://www.linkedin.com/in/benjamin-rasoli-2948ab300"}
          >
            <FaLinkedin size={30} />
          </Link>
        </li>
      </ul>
      <p className="text-primary">
        ©{new Date().getFullYear()} Personal Keeps | All Rights Reserved
      </p>
    </div>
  );
}

export default Footer;
