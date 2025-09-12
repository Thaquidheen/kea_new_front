import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { 
  FaTimes, FaEnvelope, FaPhoneAlt, 
  FaFacebookF, FaTwitter, FaLinkedinIn, 
  FaInstagram, FaYoutube, FaUserCircle,
  FaIdCard, FaSignOutAlt, FaChevronDown,
  FaWhatsapp, FaQrcode, FaUserEdit, FaCog
} from "react-icons/fa";
import { BiMenu } from "react-icons/bi";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../../../assets/KEAcolor.png";
import "./navbar.css";
import { Api } from "../../../api/apiurl";

// Stable avatar component (outside Navbar)
const UserAvatar = React.memo(function UserAvatar({ url, size = 20, className = "" }) {
  const [imgError, setImgError] = React.useState(false);

  if (url && !imgError) {
    return (
      <img
        src={url}
        alt="Profile"
        className={`user-avatar ${className}`}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
        onError={() => setImgError(true)}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    );
  }
  return <FaUserCircle size={size} className={className} />;
});

export default function Navbar() {
  /* ───────── state & helpers ───────── */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hideTop, setHideTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prevYRef = useRef(0);
  const tickingRef = useRef(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false);
  
  const userDropdownRef = useRef(null);
  const mobileUserDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Memoize user and token to prevent unnecessary re-renders
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  
  const token = useMemo(() => localStorage.getItem("accessToken"), []);

  // Memoize computed values
  const isAdmin = useMemo(() => user?.user_type === 'admin', [user?.user_type]);
  const isAuth = useMemo(() => !!(token && user), [token, user]);
  const displayName = useMemo(() => 
    user?.full_name || user?.fullName || user?.name || user?.username || '', 
    [user?.full_name, user?.fullName, user?.name, user?.username]
  );

  // Memoize profile picture URL to prevent recreation
  const profilePictureUrl = useMemo(() => {
    if (user?.profile_picture) {
      if (user.profile_picture.startsWith('http')) {
        return user.profile_picture;
      }
      return `${Api}${user.profile_picture}`;
    }
    return null;
  }, [user?.profile_picture]);

  // Memoize handlers to prevent recreation on every render
  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
    
    // Close all dropdowns
    setDrawerOpen(false);
    setUserDropdownOpen(false);
    setMobileUserDropdownOpen(false);
  }, [navigate]);

  const isActive = useCallback((path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    
    if (path !== '/') {
      if (location.pathname === path) {
        return true;
      }
      
      const pathWithSlash = path + '/';
      return location.pathname.startsWith(pathWithSlash);
    }
    
    return false;
  }, [location.pathname]);

  const toggleUserDropdown = useCallback((e) => {
    e.stopPropagation();
    setUserDropdownOpen(prev => !prev);
  }, []);

  const toggleMobileUserDropdown = useCallback((e) => {
    e.stopPropagation();
    setMobileUserDropdownOpen(prev => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  // Optimize click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerOpen && !e.target.closest('.mobile-nav') && !e.target.closest('.menu-toggle')) {
        setDrawerOpen(false);
      }
      
      if (userDropdownOpen && 
          userDropdownRef.current && 
          !userDropdownRef.current.contains(e.target) &&
          !e.target.closest('.user-account')) {
        setUserDropdownOpen(false);
      }
      
      if (mobileUserDropdownOpen && 
          mobileUserDropdownRef.current && 
          !mobileUserDropdownRef.current.contains(e.target) &&
          !e.target.closest('.mobile-user-info')) {
        setMobileUserDropdownOpen(false);
      }
    };

    // Only add listener if any dropdown is open
    if (drawerOpen || userDropdownOpen || mobileUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [drawerOpen, userDropdownOpen, mobileUserDropdownOpen]);

  // Optimize scroll handler
  useEffect(() => {
    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        window.requestAnimationFrame(() => {
          const current = window.scrollY;
          const prev = prevYRef.current;
          
          const nextHideTop = current > prev && current > 80;
          const nextScrolled = current > 20;
          
          // Only update if values actually changed
          setHideTop(currentHideTop => {
            if (currentHideTop !== nextHideTop) {
              return nextHideTop;
            }
            return currentHideTop;
          });
          
          setScrolled(currentScrolled => {
            if (currentScrolled !== nextScrolled) {
              return nextScrolled;
            }
            return currentScrolled;
          });
          
          prevYRef.current = current;
          tickingRef.current = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []); // Empty dependency array since we're using refs

  // Optimize body overflow effect
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : 'auto';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [drawerOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setDrawerOpen(false);
    setMobileUserDropdownOpen(false);
  }, [location.pathname]); // Only depend on pathname, not entire location object

  // Optimize user sync - only listen to localStorage changes, not re-read constantly
  useEffect(() => {
    const syncUser = () => {
      try {
        const userData = localStorage.getItem("user");
        const parsedUser = userData ? JSON.parse(userData) : null;
        setUser(prevUser => {
          // Only update if user data actually changed
          if (JSON.stringify(prevUser) !== JSON.stringify(parsedUser)) {
            return parsedUser;
          }
          return prevUser;
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    };

    const onStorage = (e) => { 
      if (e.key === "user") {
        syncUser();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("userUpdated", syncUser);
    
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  // Memoize navigation items to prevent recreation
  const navigationItems = useMemo(() => [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About us' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/all-events', label: 'Events' },
    { path: '/entrepreneurship', label: 'Entrepreneurship' },
    { path: '/newsandarticles', label: 'News & Articles' },
    { path: '/activitiesandtravels', label: 'Activities & Travels' }
  ], []);

  // Memoize social links to prevent recreation
  const socialLinks = useMemo(() => [
    { href: "https://www.facebook.com/keabengaluru/", icon: FaFacebookF, label: "Facebook" },
    { href: "https://x.com/KEABLR1", icon: FaTwitter, label: "Twitter" },
    { href: "https://www.linkedin.com/groups/10314275/", icon: FaLinkedinIn, label: "LinkedIn" },
    { href: "https://www.instagram.com/keabinfo", icon: FaInstagram, label: "Instagram" },
    { href: "https://www.youtube.com/channel/UCJosvwV5KPa1XHnczWWdEig", icon: FaYoutube, label: "YouTube" },
    { href: "https://wa.me/9590719394", icon: FaWhatsapp, label: "Contact us on WhatsApp" }
  ], []);

  /* ───────── JSX ───────── */
  return (
    <>
      {/* TOP BAR */}
      <div className={`header-top ${hideTop ? "hide" : ""}`}>
        <div className="header-top__left">
          <div className="header-contact">
            <FaEnvelope size={14} />
            <a href="mailto:keab.info@gmail.com">keab.info@gmail.com</a>
          </div>
          <div className="header-contact">
            <FaPhoneAlt size={14} />
            <a href="tel:+919590719394">+91 9590719394</a>
          </div>
        </div>
        
        <div className="header-top__right">
          <div className="header-social">
            <span className="follow-text">Follow Us</span>
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <div className="icon-wrapper"><Icon size={16} /></div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className={`main-nav ${scrolled ? "scrolled" : ""}`} style={{ top: hideTop ? 0 : "var(--topbar-height)" }}>
        <div className="main-nav__container">
          <Link to="/" className="brand-logo">
            <img src={logo} alt="KEA logo" />
          </Link>

          <ul className="nav-menu">
            {navigationItems.map(({ path, label }) => (
              <li key={path} className={`nav-menu__item ${isActive(path) ? 'active' : ''}`}>
                <Link to={path} className="nav-menu__link">{label}</Link>
              </li>
            ))}
          </ul>

          {isAuth ? (
            <div className="user-account" onClick={toggleUserDropdown}>
            <UserAvatar size={20} />
{/* +             <UserAvatar size={20} url={profilePictureUrl} /> */}
              <span className="user-account__name">{displayName}</span>
              <FaChevronDown className={`dropdown-arrow ${userDropdownOpen ? 'rotated' : ''}`} />
              
              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="user-dropdown" ref={userDropdownRef}>
                  <div className="user-dropdown__header">
                 <UserAvatar size={36} />
{/* +                   <UserAvatar size={36} url={profilePictureUrl} /> */}
                    <div className="user-dropdown__info">
                      <span className="user-dropdown__name">{displayName}</span>
                      <span className="user-dropdown__email">{user?.email}</span>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <Link to="/profile-edit" className={`dropdown-item ${isActive('/profile-edit') ? 'active' : ''}`}>
                    <FaUserEdit size={16} />
                    <span>Edit Profile</span>
                  </Link>
                  
                  <Link to="/membership-card" className={`dropdown-item ${isActive('/membership-card') ? 'active' : ''}`}>
                    <FaIdCard size={16} />
                    <span>Membership Card</span>
                  </Link>
                  
                  {isAdmin && (
                    <Link to="/qr-checkin" className={`dropdown-item ${isActive('/qr-checkin') ? 'active' : ''}`}>
                      <FaQrcode size={16} />
                      <span>Verify QR</span>
                    </Link>
                  )}
                  
                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">
                <button className={`btn-login ${isActive('/login') ? 'active-btn' : ''}`}>Login</button>
              </Link>
              <Link to="/register">
                <button className={`btn-signup ${isActive('/register') ? 'active-btn' : ''}`}>Register</button>
              </Link>
            </div>
          )}

          <div className="menu-toggle" onClick={openDrawer}>
            <BiMenu size={28} />
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`mobile-nav ${drawerOpen ? "open" : ""}`}>
        <FaTimes className="close-btn" size={24} onClick={closeDrawer} />

        <ul className="mobile-nav__list">
          {navigationItems.map(({ path, label }) => (
            <li key={path} className={`mobile-nav__item ${isActive(path) ? 'active' : ''}`}>
              <Link to={path} className="mobile-nav__link" onClick={closeDrawer}>{label}</Link>
            </li>
          ))}

          {isAuth ? (
            <>
              <li className="mobile-user-info" onClick={toggleMobileUserDropdown}>
               <UserAvatar size={24} />
{/* +               <UserAvatar size={24} url={profilePictureUrl} /> */}
                <span>{displayName}</span>
                <FaChevronDown className={`dropdown-arrow ${mobileUserDropdownOpen ? 'rotated' : ''}`} />
              </li>  
              
              {mobileUserDropdownOpen && (
                <div className="mobile-user-dropdown" ref={mobileUserDropdownRef}>
                  <li className={`mobile-nav__item ${isActive('/profile-edit') ? 'active' : ''}`}>
                    <Link to="/profile-edit" onClick={closeDrawer} className="mobile-nav__link">
                      <FaUserEdit size={16} /> 
                      <span>Edit Profile</span>
                    </Link>
                  </li>
                  
                  <li className={`mobile-nav__item ${isActive('/membership-card') ? 'active' : ''}`}>
                    <Link to="/membership-card" onClick={closeDrawer} className="mobile-nav__link">
                      <FaIdCard size={16} /> 
                      <span>Membership Card</span>
                    </Link>
                  </li>
                  
                  {isAdmin && (
                    <li className={`mobile-nav__item ${isActive('/qr-checkin') ? 'active' : ''}`}>
                      <Link to="/qr-checkin" onClick={closeDrawer} className="mobile-nav__link">
                        <FaQrcode size={16} /> 
                        <span>Verify QR</span>
                      </Link>
                    </li>
                  )}
                  
                  <li className="mobile-nav__item">
                    <button className="mobile-nav__logout" onClick={handleLogout}>
                      <FaSignOutAlt size={16} />
                      <span>Logout</span>
                    </button>
                  </li>
                </div>
              )}
            </>
          ) : (
            <>
              <li className={`mobile-nav__item ${isActive('/login') ? 'active' : ''}`}>
                <Link to="/login" className="mobile-nav__link" onClick={closeDrawer}>Login</Link>
              </li>
              <li className={`mobile-nav__item ${isActive('/register') ? 'active' : ''}`}>
                <Link to="/register" className="mobile-nav__link" onClick={closeDrawer}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Background overlay when mobile menu is open */}
      {drawerOpen && (
        <div className="mobile-overlay" onClick={closeDrawer} />
      )}
    </>
  );
}