import { useState, useEffect } from "react";
import localForage from "localforage"
import { Sumary } from "./components/Sumary";
import { NavBar } from "./components/NavBar";
import { Movies } from "./components/Movies";
import { WatchedMovies } from "./components/WatchedMovies";
import { MovieDetails } from "./components/MovieDetails";
import { useWatchedMovie } from "./hooks/useWatchedMovies";
import { apiKey } from "./utils/apiKey"

const ListBox = ({children}) => <div className="box">{children}</div>

const useClickedMovie = (watchedMovies, setWatchedMovies) => {
  const [clickedMovie, setClickedMovie] = useState([])
  const [rating, setRating] = useState("")
  const [tempRating, setTempRating] = useState("")

  const handleBackClick = () => {
    setClickedMovie([])
    setRating()
  }
  const handleRatingClick = (rating) => setRating(rating)
  const handleMovieClick = (movie) => {
    const isFilmOnList = watchedMovies.find(film => film.imdbID == movie.imdbID)
    const isTheSameFilm = movie.imdbID == clickedMovie.imdbID
    if(isFilmOnList || isTheSameFilm) {
      return
    }

    const idMovieClicked = (movie.imdbID);

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${idMovieClicked}`)
      .then(data => data.json())
      .then(resp => {
        if(resp.Runtime === "N/A") {
          setClickedMovie({...resp, Runtime: "0 min"})
          return
        }
        setClickedMovie(resp)
      })
      .catch(error => alert(error.message))
  }
  const handleAddFilm = () => {
    setWatchedMovies(prev => [...prev, {...clickedMovie, rate: rating}])
    setClickedMovie([])
    setRating("")
  }
  const handleMouseEnter = (rating) => {setTempRating(rating)}
  const handleMouseLeave = () => {setTempRating("")}

  return {clickedMovie, setClickedMovie, handleBackClick, handleRatingClick, handleMovieClick, handleAddFilm, rating, handleMouseEnter, handleMouseLeave, tempRating}
}

const Main = ({movies}) => {
  const {watchedMovies, setWatchedMovies, minutesWatched, handleDeleteClick} = useWatchedMovie()
  const {clickedMovie, setClickedMovie, handleBackClick, handleRatingClick, handleMovieClick, handleAddFilm, rating, handleMouseEnter, handleMouseLeave, tempRating} = useClickedMovie(watchedMovies, setWatchedMovies)

  useEffect(() => {
    setClickedMovie([])
  }, [movies])

  useEffect(() => {
    localForage.setItem("watchedMovies", watchedMovies)
      .catch(error => alert(error.message))
  }, [watchedMovies])

  useEffect(() => {
    localForage.getItem("watchedMovies")
      .then(movies => movies && setWatchedMovies(movies))
      .catch(error => alert(error.message))
  }, [])

  return (
    <main className="main">
        <ListBox>
          <Movies movies={movies} onMovieClick={handleMovieClick}/>
        </ListBox>

        <ListBox>
          {clickedMovie?.length === 0 && <Sumary watchedMovies={watchedMovies} minutesWatched={minutesWatched}/>}

          {clickedMovie?.length !== 0 &&
          <MovieDetails onButtonBackClick={handleBackClick} clickedMovie={clickedMovie} onClickRating={handleRatingClick} onClickAddFilm={handleAddFilm} rating={rating} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} tempRating={tempRating}/>
          }

          {clickedMovie?.length === 0 && <WatchedMovies watchedMovies={watchedMovies} onDeleteClick={handleDeleteClick}/>}
        </ListBox>
      </main>
  )
}

const App = () => {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=lake`)
    .then(data => data.json())
    .then(resp => {
      setMovies(resp.Search)
    })
    .catch(error => alert(error.message))
  }, [])

  return (
    <>
      <NavBar movies={movies} setMovies={setMovies}/>
      <Main movies={movies}/>
    </>
  )
};

export default App;
