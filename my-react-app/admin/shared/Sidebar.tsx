import { Link } from "react-router-dom";
import "../../assets/css/admin.css";

import logo from "../../assets/img/admin/grp-logo.png";

import { CardList, Plus } from "../shared/Icon";
import { useState } from "react";

type NavLinkType = {
  href: string;
  icon: JSX.Element;
  text: string;
};

const NavLink = ({
  href,
  icon,
  text,
  isActive,
  onClick,
}: NavLinkType & { isActive: boolean; onClick: () => void }) => {
  const activeClassName = isActive ? "active" : "";
  return (
    <li className={`nav-item ${activeClassName}`}>
      <Link className="nav-link" to={href} onClick={onClick}>
        <span className="nav-icon">{icon}</span>
        <span className="nav-link-text">{text}</span>
      </Link>
    </li>
  );
};

const SideBar = () => {
  const [activeLink, setActiveLink] = useState("#0");

  const handleNavLinkClick = (href: string) => {
    setActiveLink(href);
  };

  return (
    <div id="app-sidepanel" className="app-sidepanel sidepanel-visible">
      <div id="sidepanel-drop" className="sidepanel-drop"></div>
      <div className="sidepanel-inner d-flex flex-column">
        <a href="#" id="sidepanel-close" className="sidepanel-close d-xl-none">
          ×
        </a>
        <div className="app-branding">
          <a className="app-logo" href="index.html">
            <img className="logo-icon me-2" src={logo} alt="logo" />
          </a>
        </div>
        <nav className="app-nav app-nav-main flex-grow-1">
          <ul className="app-menu list-unstyled accordion" id="menu-accordion">
            <NavLink
              href="list"
              text="Candidates List"
              icon={<CardList />}
              isActive={activeLink === "#0"}
              onClick={() => handleNavLinkClick("#0")}
            />
            <NavLink
              href="create"
              text="Create New Job"
              icon={<Plus />}
              isActive={activeLink === "#1"}
              onClick={() => handleNavLinkClick("#1")}
            />
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;