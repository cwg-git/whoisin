import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '../images/logo.jpg';
import es from '../images/ar.png';
import en from '../images/en.png';
import ec from '../images/fr.png';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const getObjectFromPathname = () => {
    const pathname = location.pathname;
    const match = pathname.split('/')[1];
    return match;
  };

  const isActive = (_pageObject_) => {
    const _object_ = getObjectFromPathname();
    return _object_ === _pageObject_ ? 'active' : '';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
      setIsSearchOpen(false);
      setSearchText('');
    }
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchText('');
  };

  const switchLanguage = (lang) => {
    if (lang === 'es') {
      window.location.reload();
      return;
    }

    const translateUrl = `https://translate.google.com/translate?hl=${lang}&sl=es&tl=${lang}&u=${encodeURIComponent(window.location.href)}`;
    window.location.href = translateUrl;
  };

  return (
    <header id="header" className="header sticky-top">
      <div className="container position-relative d-flex align-items-center justify-content-end">
        {/* Logo */}
        <div className="logo-block">
          <a href="/"><img src={logo} alt="Whoisin Barcelona Logo" /></a>
        </div>

        <div className="rt-block ms-auto">
          {/* Top social & search */}
          <div className="top-block d-flex justify-content-end">
            <div className="socila-media">
              <ul className="d-flex">
                <li>
                  <a href="https://www.facebook.com/YallaLebanondotcom/" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-facebook"></i>
                  </a>
                </li> 
                <li>
                  <a href="https://www.instagram.com/yallalebanon_com/" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="https://x.com/i/flow/login?redirect_after_login=%2FYallaLebanon" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                </li>
              </ul>
            </div>

            <div className="search">
              <a 
                href="#search" 
                role="button" 
                aria-label="Search"
                onClick={(e) => {
                  e.preventDefault();
                  handleSearchIconClick();
                }}
              >
                <i className={`fa ${isSearchOpen ? 'fa-times' : 'fa-search'}`}></i>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="bottom-block d-flex justify-content-end align-items-center">
            <div className="navigation">
              <div id="nav-wrap">
                <ul className="sf-menu">
                  <li className={isActive('')}>
                    <a href="/">¡Hola Barcelona!</a>
                  </li>
                  <li className={isActive('categories')}>
                    <a href="/categories">Categorías</a>
                  </li>
                  {/* <li className={isActive('today')}>
                    <a href="/today">Hoy</a>
                  </li> */}
                  {/* <li className={isActive('this-week')}>
                    <a href="/this-week">This week</a>
                  </li> */}
                  <li className={isActive('fiestas-mayor')}>
                    <a href="/fiestas-mayor">Fiestas Mayor</a>
                  </li>
                  <li className={isActive('festivales')}>
                    <a href="/festivales">Festivales</a>
                  </li>
                  {/* <li className={isActive('agendas')}>
                    <a href="/agendas">Agenda</a>
                  </li>
                   */}
                  <li className={isActive('subscriptions')}>
                    <a href="/subscriptions">Suscripciones</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Language switch */}
            <div className="language-btn d-flex">
              <button 
                onClick={() => switchLanguage('es')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img src={es} alt="Español" />
              </button>
              <button 
                onClick={() => switchLanguage('ca')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img src={ec} alt="Català" />
              </button>
              <button 
                onClick={() => switchLanguage('en')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img src={en} alt="English" />
              </button>
            </div>
          </div>
          <div className="clearfix"></div>
        </div>

        {/* Desktop Search Overlay */}
        <div className={`desktop-search-overlay ${isSearchOpen ? 'open' : ''}`}>
          <div className="container">
            <form onSubmit={handleSearchSubmit} className="desktop-search-form">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Buscar blogs y eventos..."
                className="desktop-search-input"
                autoFocus
              />
              <button type="submit" className="desktop-search-btn">
                <i className="fa fa-search"></i>
              </button>
              <button 
                type="button" 
                className="desktop-search-close"
                onClick={() => setIsSearchOpen(false)}
              >
                <i className="fa fa-times"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="mobile-menu-block">
          <span className="menu-icon" 
              onClick={() => {
                console.log("menu clicked");
                setIsMobileMenuOpen(true);
              }}>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
            <span className="clearfix"></span>
          </span>
        </div>

        {/* Mobile menu overlay */}
        <div className={`overlay ${isMobileMenuOpen ? 'open-mobile-menu' : ''}`}>
          <div className="menu-box"></div>
          <button
            className="closebtn"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            &times;
          </button>
          <div className="overlay-content">
            <div className="menu-block"></div>
            
            {/* Mobile Search Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (searchText.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
                setIsMobileMenuOpen(false);
                setSearchText('');
              }
            }} className="mobile-search-form">
              <div className="mobile-search-input-group">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Buscar blogs y eventos..."
                  className="mobile-search-input"
                />
                <button type="submit" className="mobile-search-btn">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </form>

            <ul className="mobile-menu">
              <li><a href="/" onClick={() => setIsMobileMenuOpen(false)}>¡Hola Barcelona!</a></li>
              <li><a href="/categories" onClick={() => setIsMobileMenuOpen(false)}>Categorías</a></li>
              <li><a href="/today" onClick={() => setIsMobileMenuOpen(false)}>Today</a></li>
              <li><a href="/this-week" onClick={() => setIsMobileMenuOpen(false)}>This week</a></li>
              <li><a href="/agendas" onClick={() => setIsMobileMenuOpen(false)}>Agenda</a></li>
              <li><a href="/fiestas-mayor" onClick={() => setIsMobileMenuOpen(false)}>Fiestas Mayor</a></li>
              <li><a href="/festivales" onClick={() => setIsMobileMenuOpen(false)}>Festivales</a></li>
              <li><a href="/subscriptions" onClick={() => setIsMobileMenuOpen(false)}>Suscripciones</a></li>
              <li className="lang-switch">
                <button 
                  onClick={() => { switchLanguage('es'); setIsMobileMenuOpen(false); }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <img src={es} alt="Español" />
                </button>
                <button 
                  onClick={() => { switchLanguage('ca'); setIsMobileMenuOpen(false); }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <img src={ec} alt="Català" />
                </button>
                <button 
                  onClick={() => { switchLanguage('en'); setIsMobileMenuOpen(false); }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <img src={en} alt="English" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="clearfix"></div>
      </div>
    </header>
  );
};

export default Header;
