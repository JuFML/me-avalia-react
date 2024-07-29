import { useEffect } from "react"
import { useMovies } from "@/hooks/useMovies"
import localForage from "localforage"
import { Movies } from "@/components/Movies"
import { Sumary } from "@/components/Sumary"
import { MovieDetails } from "@/components/MovieDetails"
import { WatchedMovies } from "@/components/WatchedMovies"
import { Loader } from "./Loader"

const ListBox = ({children}) => <div className="box">{children}</div>

const Main = ({movies, dispatch, fetchingMovies}) => {
  const {watchedMovies, setWatchedMovies, minutesWatched, handleDeleteClick, clickedMovie, dispatchClickedMovie, handleBackClick, handleRatingClick, handleMovieClick, handleAddFilm, rating, handleMouseEnter, handleMouseLeave, tempRating, fetchingMovieDetails} = useMovies()
  
  useEffect(() => {
    dispatchClickedMovie({type: "set_clickedMovie", clickedMovie: []})
  }, [dispatchClickedMovie])

  useEffect(() => {
    localForage.setItem("watchedMovies", watchedMovies)
      .catch(error => alert(error.message))
  }, [watchedMovies])

  useEffect(() => {
    dispatch({type: "init_fetch"})
    localForage.getItem("watchedMovies")
      .then(movies => {
        movies && setWatchedMovies(movies)})
      .catch(error => alert(error.message))
      .finally(() => dispatch({type: "ended_fetch"}))
  }, [dispatch, setWatchedMovies])

  return (
    <main className="main">
        <ListBox>
          {fetchingMovies ? <Loader /> : <Movies movies={movies} onMovieClick={handleMovieClick}/>}
        </ListBox>

        <ListBox>
          {clickedMovie?.length === 0 && <Sumary watchedMovies={watchedMovies} minutesWatched={minutesWatched}/>}

          {fetchingMovieDetails ? <Loader/> :  clickedMovie?.length !== 0 &&
          <MovieDetails watchedMovies={watchedMovies} onButtonBackClick={handleBackClick} clickedMovie={clickedMovie} onClickRating={handleRatingClick} onClickAddFilm={handleAddFilm} rating={rating} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} tempRating={tempRating}/>
          }

          {!fetchingMovieDetails && clickedMovie?.length === 0 && <WatchedMovies watchedMovies={watchedMovies} onDeleteClick={handleDeleteClick} onClickedMovie={handleMovieClick}/>}
        </ListBox>
      </main>
  )
}

export { Main }