import { Routes } from "@/domain/Routes";
import { NAVBAR_HEIGHT_TAILWIND } from "@/lib/globals";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav
      className={`navbar text-base-content ${NAVBAR_HEIGHT_TAILWIND} fixed top-0 left-0 z-[1] `}
      style={{ pointerEvents: "none" }}
    >
      <div className="flex-1"></div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href={Routes.login}>Login</Link>
          </li>
          <li>
            <Link href={Routes.signup}>Signup</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
