const Navbar = ({movies}) => {

  const handleSearchClick = () => {
    console.log("aprtou");
  }

    return (
      <section className="nav-bar">
        <img className="logo" src="/images/logo-me-avalia.png" alt="" />
        <form className="form-search">
          <input className="search" type="text" placeholder="Buscar filmes..." onClick={handleSearchClick}/>
          <button className="btn-search">Buscar</button>
        </form>
        <div className="num-results"><strong>{movies.length}</strong> Resultados</div>
      </section>
    )
  };
  
  export default Navbar;