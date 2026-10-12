import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showSubmitError: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    const {username, password} = this.state

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    localStorage.setItem('username', username)
    localStorage.setItem('password', password)

    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, showSubmitError: true})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        this.onSubmitSuccess(data.jwt_token)
      } else {
        this.onSubmitFailure(data.error_msg)
      }
    } catch {
      this.onSubmitFailure('Something went wrong. Please try again')
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    const {username, password, showSubmitError, errorMsg} = this.state

    return (
      <div className="login-bg-container">
        <div className="login-header">
          <img
            src="https://res.cloudinary.com/dpn2veik7/image/upload/v1775114774/Group_7399_jchs7e.png"
            alt="login website logo"
            className="login-website-logo"
          />
        </div>

        <div className="login-card-wrapper">
          <form className="login-form-card" onSubmit={this.submitForm}>
            <h1 className="login-title">Login</h1>

            <div className="input-group">
              <label className="input-label" htmlFor="username">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                className="login-input"
                value={username}
                onChange={this.onChangeUsername}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                className="login-input"
                value={password}
                onChange={this.onChangePassword}
              />
            </div>

            {showSubmitError && <p className="error-message">{errorMsg}</p>}

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
