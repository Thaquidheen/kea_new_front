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
  
  // ✅ FIXED: Reactive user and token state that updates with localStorage changes
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Update auth state when localStorage changes (after login/logout)
  const updateAuthState = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("accessToken");
      
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setToken(storedToken);
      
      console.log('Auth state updated:', { 
        hasUser: !!storedUser, 
        hasToken: !!storedToken 
      });
    } catch (error) {
      console.error('Error updating auth state:', error);
      setUser(null);
      setToken(null);
    }
  }, []);

  // ✅ FIXED: Initialize auth state and listen for changes
  useEffect(() => {
    // Initial load
    updateAuthState();

    // Listen for storage changes (when user logs in from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'accessToken') {
        updateAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab login/logout
    const handleAuthChange = () => {
      updateAuthState();
    };
    
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, [updateAuthState]);

  // ✅ FIXED: Correct authentication logic
  const isAuth = useMemo(() => {
    const isAuthenticated = !!(token && user);
    console.log('isAuth calculated:', { token: !!token, user: !!user, isAuthenticated });
    return isAuthenticated;
  }, [token, user]);

  // Memoize computed values
  const isAdmin = useMemo(() => user?.user_type === 'admin', [user?.user_type]);
  const displayName = useMemo(() => 
    user?.full_name || user?.fullName || user?.name || user?.username || 'User', 
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

  // ✅ FIXED: Enhanced logout with auth state notification
  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    
    // Update local state immediately
    setUser(null);
    setToken(null);
    
    // Notify other components/tabs of auth change
    window.dispatchEvent(new Event('authStateChanged'));
    
    navigate("/login");
    
    // Close all dropdowns
    setDrawerOpen(false);
    setUserDropdownOpen(false);
    setMobileUserDropdownOpen(false);
  }, [navigate]);

const isActive = useCallback((path) => {
  const currentPath = location.pathname;
  
  // Home page - exact match only
  if (path === '/') {
    return currentPath === '/';
  }
  
  // All other pages - exact match only
  return currentPath === path;
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

  // Navigation items - You can uncomment this to remove entrepreneurship
  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/entrepreneurship', label: 'Entrepreneurship' },
    { path: '/newsandarticles', label: 'News & Articles' },
    { path: '/activitiesandtravels', label: 'Activities & Travels' },
    { path: '/all-events', label: 'Events' },
  ];

  // Optimize scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const scrollingDown = currentY > prevYRef.current && currentY > 100;
          
          setHideTop(scrollingDown);
          setScrolled(currentY > 50);
          
          prevYRef.current = currentY;
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <>
      {/* TOP BAR */}
      <div className={`header-top ${hideTop ? 'hidden' : ''}`}>
        <div className="header-top__left">
          <span className="header-contact">
            <FaEnvelope size={12} />
            <span>keaalumniblr@kea.ac.in</span>
          </span>
          <span className="header-contact">
            <FaPhoneAlt size={12} />
            <span>+91 7349799660</span>
          </span>
        </div>

        <div className="header-top__right">
          <span className="follow-text">Follow us on:</span>
          <div className="header-social">
            <a href="#" aria-label="Facebook"><FaFacebookF size={12} /></a>
            <a href="#" aria-label="Twitter"><FaTwitter size={12} /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn size={12} /></a>
            <a href="#" aria-label="Instagram"><FaInstagram size={12} /></a>
            <a href="#" aria-label="YouTube"><FaYoutube size={12} /></a>
            <a href="https://wa.me/917349799660" aria-label="WhatsApp"><FaWhatsapp size={12} /></a>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <nav className={`main-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="main-nav__container">
          <Link to="/" className="brand-logo">
            <img src={logo} alt="KEA Bengaluru" />
          </Link>

          <ul className="nav-menu">
            {navigationItems.map(({ path, label }) => (
              <li key={path} className={`nav-menu__item ${isActive(path) ? 'active' : ''}`}>
                <Link to={path} className="nav-menu__link">{label}</Link>
              </li>
            ))}
          </ul>

          {/* ✅ FIXED: Authentication state properly checked */}
          {isAuth ? (
            <div className="user-account" onClick={toggleUserDropdown}>
              <UserAvatar url={profilePictureUrl} size={24} />
              <span className="user-account__name">{displayName}</span>
              <FaChevronDown className={`dropdown-arrow ${userDropdownOpen ? 'rotated' : ''}`} />
              
              {userDropdownOpen && (
                <div className="user-dropdown" ref={userDropdownRef}>
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

        <ul className="mobile-nav__list" >
          {navigationItems.map(({ path, label }) => (
            <li key={path} className={`mobile-nav__item ${isActive(path) ? 'active' : ''}`}>
              <Link to={path} className="mobile-nav__link" onClick={closeDrawer}>{label}</Link>
            </li>
          ))}

          {/* ✅ FIXED: Mobile authentication state properly checked */}
          {isAuth ? (
            <>
              <li className="mobile-user-info" onClick={toggleMobileUserDropdown}>
                <UserAvatar url={profilePictureUrl} size={24} />
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