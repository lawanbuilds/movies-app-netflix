import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Search extends Component {
  state = {
    searchInput: '',
    searchedMovies: [],
    apiStatus: apiStatusConstants.initial,
    lastSearchedValue: '',
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getSearchResults = async () => {
    const {searchInput} = this.state
    if (searchInput.trim() === '') {
      return
    }

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
      lastSearchedValue: searchInput,
    })

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const formattedData = data.results.map(each => ({
          id: each.id,
          backdropPath: each.backdrop_path,
          overview: each.overview,
          posterPath: each.poster_path,
          title: each.title,
        }))

        this.setState({
          searchedMovies: formattedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/movies-app/request-failed-img.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.getSearchResults}
      >
        Try Again
      </button>
    </div>
  )

  renderNoResultsView = () => {
    const {lastSearchedValue} = this.state
    return (
      <div className="no-movies-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/movies-app/no-movies-img.png"
          alt="no movies"
          className="no-movies-image"
        />
        <p className="no-movies-text">
          {`Your search for ${lastSearchedValue} did not find any matches.`}
        </p>
      </div>
    )
  }

  renderSuccessView = () => {
    const {searchedMovies} = this.state

    if (searchedMovies.length === 0) {
      return this.renderNoResultsView()
    }

    return (
      <ul className="search-movies-grid">
        {searchedMovies.map(movie => (
          <li key={movie.id} className="search-movie-item">
            <Link to={`/movies/${movie.id}`}>
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="search-movie-card-img"
              />
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderSearchBody = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="search-page-bg">
        <Header
          searchInput={searchInput}
          changeSearchInput={this.changeSearchInput}
          getSearchResults={this.getSearchResults}
        />
        <main className="search-main-content">{this.renderSearchBody()}</main>
      </div>
    )
  }
}

export default Search
