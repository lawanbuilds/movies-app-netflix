import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import './index.css'

class Header extends Component {
  render() {
    const {match, searchInput, changeSearchInput, getSearchResults} = this.props
    const isSearchRoute = match.path === '/search'
    const isPopularRoute = match.path === '/popular'
    const isHomeRoute = match.path === '/'

    return (
      <nav className={`nav-header ${isSearchRoute ? 'search-nav-bg' : ''}`}>
        <div className="nav-content">
          <div className="logo-nav-items">
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dpn2veik7/image/upload/v1775114774/Group_7399_jchs7e.png"
                alt="website logo"
                className="header-logo"
              />
            </Link>
            <ul className="nav-links-list">
              <li>
                <Link
                  to="/"
                  className={`nav-link ${isHomeRoute ? 'active-link' : ''}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/popular"
                  className={`nav-link ${isPopularRoute ? 'active-link' : ''}`}
                >
                  Popular
                </Link>
              </li>
            </ul>
          </div>

          <div className="search-profile-container">
            {isSearchRoute ? (
              <div className="search-bar-container">
                <input
                  type="search"
                  value={searchInput}
                  onChange={changeSearchInput}
                  onKeyDown={e => e.key === 'Enter' && getSearchResults()}
                  className="search-input-field"
                />
                <button
                  type="button"
                  testid="searchButton"
                  className="search-input-btn"
                  onClick={getSearchResults}
                >
                  <HiOutlineSearch size={16} color="#dcdcdc" />
                </button>
              </div>
            ) : (
              <Link to="/search">
                <button
                  type="button"
                  testid="searchButton"
                  className="search-icon-btn"
                >
                  <HiOutlineSearch size={20} color="#ffffff" />
                </button>
              </Link>
            )}
            <Link to="/account">
              <img
                src="https://res.cloudinary.com/dpn2veik7/image/upload/v1791804116/Avatar_1_hcpdvf.png"
                alt="profile"
                className="profile-logo"
              />
            </Link>
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)
