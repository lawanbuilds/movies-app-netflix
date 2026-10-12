import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const Account = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const rawUsername = localStorage.getItem('username') || 'rahul'
  const displayUsername = rawUsername.includes('@')
    ? rawUsername
    : `${rawUsername}@gmail.com`

  const password = localStorage.getItem('password') || 'rahul@2021'
  const maskedPassword = '*'.repeat(password.length || 10)

  return (
    <div className="account-route-container">
      <Header />
      <div className="account-body-container">
        <div className="account-content-card">
          <h1 className="account-main-heading">Account</h1>
          <hr className="account-divider" />

          {/* Membership Section */}
          <div className="account-section-row">
            <p className="account-section-label">Member ship</p>
            <div className="account-section-value-wrapper">
              <p className="account-user-text">{displayUsername}</p>
              <div className="account-password-row">
                <p className="account-password-label">Password</p>
                <p className="account-password-value"> : {maskedPassword}</p>
              </div>
            </div>
          </div>
          <hr className="account-divider" />

          {/* Plan Details Section */}
          <div className="account-section-row">
            <p className="account-section-label">Plan details </p>
            <div className="account-section-value-wrapper plan-row">
              <p className="account-plan-name">Premium</p>
              <p className="account-plan-badge">Ultra HD</p>
            </div>
          </div>
          <hr className="account-divider" />

          {/* Logout Button */}
          <div className="account-logout-wrapper">
            <button
              type="button"
              className="account-logout-btn"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Account
