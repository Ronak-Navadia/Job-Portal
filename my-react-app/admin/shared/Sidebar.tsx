import { Link } from "react-router-dom";

import logo from "../../assets/img/admin/grp-logo.png";

import { ApplicationIcon, CardList, CategoriesIcon, Plus } from "../shared/Icon";
import { useState, useEffect } from "react";
import clsx from "clsx";

import { NavLinkType } from "./types";

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

const SideBar = ({ sidebarOpen, handleClose }: any) => {
  const [activeLink, setActiveLink] = useState("#0");

  useEffect(() => {
    const currentRoute = window.location.pathname;
    if (currentRoute === "/admin/job-category-list") {
      setActiveLink("#0");
    } else if (currentRoute === "/admin/create-new-job") {
      setActiveLink("#1");
    } else if (currentRoute === "/admin/job-list") {
      setActiveLink("#2");
    } else if (currentRoute === "/admin/application-list") {
      setActiveLink("#3");
    }
  }, []);

  const handleNavLinkClick = (href: string) => {
    setActiveLink(href);
    handleClose();

  };

  return (
    <div
      id="app-sidepanel"
      className={clsx({ "sidepanel-visible": sidebarOpen }, "app-sidepanel")}
    >
      <div id="sidepanel-drop" className="sidepanel-drop"></div>
      <div className="sidepanel-inner d-flex flex-column">
        <button
          id="sidepanel-close"
          className="sidepanel-close d-xl-none"
          onClick={handleClose}
        >
          &times;
        </button>
        <div className="app-branding">
          <a className="app-logo" href="/admin/job-category-list">
            <img className="logo-icon me-2" src={logo} alt="logo" />
          </a>
        </div>
        <nav className="app-nav app-nav-main flex-grow-1">
          <ul className="app-menu list-unstyled accordion" id="menu-accordion">
            <NavLink
              href="job-category-list"
              text="Job Categories"
              icon={<CategoriesIcon />}
              isActive={activeLink === "#0"}
              onClick={() => handleNavLinkClick("#0")}
            />
            <NavLink
              href="create-new-job"
              text="Create New Job"
              icon={<Plus />}
              isActive={activeLink === "#1"}
              onClick={() => handleNavLinkClick("#1")}
            />
            <NavLink
              href="job-list"
              text="Job List"
              icon={<CardList />}
              isActive={activeLink === "#2"}
              onClick={() => handleNavLinkClick("#2")}
            />
            <NavLink
              href="application-list"
              text="Application List"
              icon={<ApplicationIcon />}
              isActive={activeLink === "#3"}
              onClick={() => handleNavLinkClick("#3")}
            />
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
