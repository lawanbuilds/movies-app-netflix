import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {
    bannerMovie: {},
    trendingMovies: [],
    trendingApiStatus: apiStatusConstants.initial,
    originalsMovies: [],
    originalsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrendingMovies()
    this.getOriginalsMovies()
  }

  // --- 1. TRENDING MOVIES API ---
  getTrendingMovies = async () => {
    this.setState({trendingApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/trending-movies'
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
          title: each.title !== undefined ? each.title : each.name,
        }))
        this.setState({
          trendingMovies: formattedData,
          trendingApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({trendingApiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({trendingApiStatus: apiStatusConstants.failure})
    }
  }

  // --- 2. ORIGINALS MOVIES API ---
  getOriginalsMovies = async () => {
    this.setState({originalsApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/originals'
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
          title: each.title !== undefined ? each.title : each.name,
        }))

        // Pick random movie from originals for banner
        const randomIndex = Math.floor(Math.random() * formattedData.length)
        const randomBannerMovie = formattedData[randomIndex]

        this.setState({
          bannerMovie: randomBannerMovie,
          originalsMovies: formattedData,
          originalsApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({originalsApiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({originalsApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderSectionFailureView = onRetry => (
    <div className="section-failure-container">
      <img
        src="https://res.cloudinary.com/dpn2veik7/image/upload/v1791804684/alert-triangle_l21wph.png"
        alt="failure view"
        className="section-failure-icon"
      />
      <p className="section-failure-text">
        Something went wrong. Please try again
      </p>
      <button type="button" className="section-try-again-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  )

  renderBannerSection = () => {
    const {originalsApiStatus, bannerMovie} = this.state

    switch (originalsApiStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="home-banner-loader-container">
            <Header />
            {this.renderLoader()}
          </div>
        )
      case apiStatusConstants.success: {
        const {title, overview, backdropPath} = bannerMovie
        return (
          <div
            className="home-banner-container"
            style={{backgroundImage: `url(${backdropPath})`}}
          >
            <Header />
            <div className="home-banner-content">
              <h1 className="home-banner-title">{title}</h1>
              <p className="home-banner-desc">{overview}</p>
              <button type="button" className="home-play-btn">
                Play
              </button>
            </div>
            <div className="home-banner-bottom-gradient" />
          </div>
        )
      }
      case apiStatusConstants.failure:
        return (
          <div className="home-banner-failure-container">
            <Header />
            {this.renderSectionFailureView(this.getOriginalsMovies)}
          </div>
        )
      default:
        return null
    }
  }

  renderSlider = moviesList => (
    <div className="slider-wrapper">
      <Slider {...sliderSettings}>
        {moviesList.map(movie => (
          <div key={movie.id} className="slick-item-card">
            <Link to={`/movies/${movie.id}`}>
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="movie-shelf-poster"
              />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  )

  renderTrendingSection = () => {
    const {trendingApiStatus, trendingMovies} = this.state
    switch (trendingApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSlider(trendingMovies)
      case apiStatusConstants.failure:
        return this.renderSectionFailureView(this.getTrendingMovies)
      default:
        return null
    }
  }

  renderOriginalsSection = () => {
    const {originalsApiStatus, originalsMovies} = this.state
    switch (originalsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSlider(originalsMovies)
      case apiStatusConstants.failure:
        return this.renderSectionFailureView(this.getOriginalsMovies)
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-route-container">
        {this.renderBannerSection()}
        <div className="home-shelves-section">
          <h1 className="shelf-title">Trending Now</h1>
          {this.renderTrendingSection()}

          <h1 className="shelf-title">Originals</h1>
          {this.renderOriginalsSection()}
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
