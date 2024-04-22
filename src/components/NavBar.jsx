import { useEffect, useRef } from "react"

const apiKey = import.meta.env.VITE_API_KEY

const NavBar = ({movies, setMovies}) => {
  const formRef = useRef(null)

  useEffect(() => {
    if(formRef.current.inputFilm.value.length > 0) {
      formRef.current.reset()
    }
  }, [movies])

  const handleSearchSubmit = (e) => {
    e.preventDefault()    
    const {inputFilm} = e.target.elements

    if(inputFilm.value.length < 2) {
      return
    }

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${inputFilm.value}`)
      .then(data => data.json())
      .then(resp => {
        setMovies(resp.Search)
      })
      .catch(error => alert(error.message))
  }

  return (
  <nav className="nav-bar">
        <img className="logo" src="/images/logo-me-avalia.png" alt="" />
        <form ref={formRef} className="form-search" onSubmit={handleSearchSubmit}>
          <input name="inputFilm" className="search" type="text" placeholder="Buscar filmes..." />
          <button className="btn-search">Buscar</button>
        </form>
        <p className="num-results"><strong>{movies?.length || 0}</strong> Resultados</p>
      </nav>
)}

export { NavBar }