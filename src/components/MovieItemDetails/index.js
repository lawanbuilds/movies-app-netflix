import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {format} from 'date-fns'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MovieItemDetails extends Component {
  state = {
    movieDetails: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMovieDetails()
  }

  componentDidUpdate(prevProps) {
    const {match} = this.props
    if (prevProps.match.params.id !== match.params.id) {
      this.getMovieDetails()
    }
  }

  getMovieDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/movies-app/movies/${id}`
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
        const fetchedMovie = data.movie_details

        const formattedData = {
          adult: fetchedMovie.adult,
          backdropPath: fetchedMovie.backdrop_path,
          budget: fetchedMovie.budget,
          genres: fetchedMovie.genres.map(each => ({
            id: each.id,
            name: each.name,
          })),
          id: fetchedMovie.id,
          overview: fetchedMovie.overview,
          posterPath: fetchedMovie.poster_path,
          releaseDate: fetchedMovie.release_date,
          runtime: fetchedMovie.runtime,
          similarMovies: fetchedMovie.similar_movies.map(each => ({
            backdropPath: each.backdrop_path,
            id: each.id,
            overview: each.overview,
            posterPath: each.poster_path,
            title: each.title,
          })),
          spokenLanguages: fetchedMovie.spoken_languages.map(each => ({
            id: each.id,
            englishName: each.english_name,
          })),
          title: fetchedMovie.title,
          voteAverage: fetchedMovie.vote_average,
          voteCount: fetchedMovie.vote_count,
        }

        this.setState({
          movieDetails: formattedData,
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
        src="https://res.cloudinary.com/dpn2veik7/image/upload/v1791804684/alert-triangle_l21wph.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.getMovieDetails}
      >
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {movieDetails} = this.state
    const {
      title,
      overview,
      backdropPath,
      runtime,
      adult,
      releaseDate,
      genres,
      spokenLanguages,
      voteCount,
      voteAverage,
      budget,
      similarMovies,
    } = movieDetails

    // Runtime calculation: e.g. 162 min -> "2h 42m"
    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60
    const formattedRuntime = `${hours}h ${minutes}m`

    // Adult sensor tag
    const censorRating = adult ? 'A' : 'U/A'

    // Formatted release year & full date string
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : ''
    let formattedReleaseDate = ''
    try {
      formattedReleaseDate = releaseDate
        ? format(new Date(releaseDate), 'do MMMM yyyy')
        : ''
    } catch {
      formattedReleaseDate = releaseDate
    }

    return (
      <div className="movie-details-content-wrapper">
        {/* Banner Section */}
        <div
          className="movie-details-banner"
          style={{
            backgroundImage: `url(${backdropPath})`,
          }}
        >
          <Header />
          <div className="banner-details-bottom-container">
            <h1 className="movie-details-title">{title}</h1>
            <div className="movie-meta-info-row">
              <p className="meta-info-item">{formattedRuntime}</p>
              <p className="censor-rating-badge">{censorRating}</p>
              <p className="meta-info-item">{releaseYear}</p>
            </div>
            <p className="movie-details-overview">{overview}</p>
            <button type="button" className="movie-play-btn">
              Play
            </button>
          </div>
          <div className="banner-bottom-fade-overlay" />
        </div>

        {/* 4-Column Metadata Section */}
        <div className="movie-details-info-section">
          <div className="info-group-column">
            <h1 className="info-group-heading">genres</h1>
            <ul className="info-group-list">
              {genres.map(genre => (
                <li key={genre.id} className="info-group-item">
                  <p>{genre.name}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="info-group-column">
            <h1 className="info-group-heading">Audio Available</h1>
            <ul className="info-group-list">
              {spokenLanguages.map(language => (
                <li key={language.id} className="info-group-item">
                  <p>{language.englishName}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="info-group-column">
            <h1 className="info-group-heading">Rating Count</h1>
            <p className="info-group-value">{voteCount}</p>
            <h1 className="info-group-heading extra-top-margin">
              Rating Average
            </h1>
            <p className="info-group-value">{voteAverage}</p>
          </div>

          <div className="info-group-column">
            <h1 className="info-group-heading">Budget</h1>
            <p className="info-group-value">{budget}</p>
            <h1 className="info-group-heading extra-top-margin">
              Release Date
            </h1>
            <p className="info-group-value">{formattedReleaseDate}</p>
          </div>
        </div>

        {/* More Like This Section */}
        <div className="similar-movies-section">
          <h1 className="similar-movies-title">More like this</h1>
          <ul className="similar-movies-grid">
            {similarMovies.map(movie => (
              <li key={movie.id} className="similar-movie-item">
                <Link to={`/movies/${movie.id}`}>
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    className="similar-movie-card-img"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    return (
      <div className="movie-item-details-bg">
        {apiStatus === apiStatusConstants.inProgress && (
          <div className="details-loader-view">
            <Header />
            {this.renderLoader()}
          </div>
        )}

        {apiStatus === apiStatusConstants.failure && (
          <div className="details-loader-view">
            <Header />
            {this.renderFailureView()}
          </div>
        )}

        {apiStatus === apiStatusConstants.success && this.renderSuccessView()}
        <Footer />
      </div>
    )
  }
}

export default MovieItemDetails
