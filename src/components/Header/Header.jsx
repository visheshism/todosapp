import React, { useContext, useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "./Header.css"
import Logo from "../../images/todosapp.png"
import {
  FaPlus,
  FaRegUserCircle,
  FaSearch,
  FaTimes,
  FaSignInAlt,
  FaUserPlus,
  FaHome,
} from "react-icons/fa"
import { toast } from "react-hot-toast"
import { ctx } from "../../App"

const Header = React.memo(() => {
  const {
    isAuth,
    setShowPopup: setShowForm,
    setHeaderHeight,
    deviceType,
  } = useContext(ctx) 
  
  const location = useLocation()
  const { pathname: currentLocation } = location
  
  const header = useRef(null)
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    toast.dismiss()
  }, [location])

  useEffect(() => {
    setHeaderHeight(header.current.offsetHeight)
  }, [])


  return (
    <>
      <nav className="bg-gray-800" ref={header}>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-shrink-0 items-center justify-start select-none">
              <Link to="/">
                <img
                  className="block h-10 w-auto lg:hidden"
                  src={Logo}
                  alt="Todos App"
                />
              </Link>
              <Link to="/">
                <img
                  className="hidden h-12 w-auto lg:block"
                  src={Logo}
                  alt="Todos App"
                />
              </Link>
            </div>
            {isAuth ? (
              <LoggedInUser
                currentLocation={currentLocation}
                setShowForm={setShowForm}
                deviceType={deviceType}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                location={location}
              />
            ) : (
              <div className="absolute right-0">
                {currentLocation === "/login" ? (
                  <Link
                    to="/signup"
                    className="bg-indigo-500 hover:bg-indigo-400 active:scale-95 transition-all ease-in-out text-white rounded-md px-3 py-1.5 text-base font-medium flex items-center"
                  >
                    Signup
                    <FaUserPlus className="ml-2" />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="bg-indigo-500 hover:bg-indigo-400 active:scale-95 transition-all ease-in-out text-white rounded-md px-3 py-1.5 text-base font-medium flex items-center"
                  >
                    Login
                    <FaSignInAlt className="ml-2" />
                  </Link>
                )}{" "}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
})

const LoggedInUser = ({
  currentLocation,
  setShowForm,
  deviceType,
  location,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const showTheFormFunc = () => {
    setShowForm(true)
  }
  
  const SearchBar = () => {
    const searchParam = new URLSearchParams(location.search).get("q")
    const categParam = new URLSearchParams(location.search).get("categ")

    const [searchFocus, setSearchFocus] = useState(false)
    const [inputValue, setInputValue] = useState(searchParam || "")

    const btnStyle = `bg-cyan-600 hover:bg-opacity-90 active:bg-cyan-500 absolute right-0 py-[5px] rounded text-sm font-medium tracking-wider text-white border-2 border-cyan-600 hover:border-cyan-500 ${
      deviceType === "xs" ? "px-1.5" : "px-4"
    }`

    return (
      <>
        <div
          className={`flex items-center px-2  sm:w-[calc(100%-220px)] w-[calc(100%-190px)] absolute left-[56px] sm:left-[72px] `}
          id="searchBox"
          onBlur={() => setSearchFocus(false)}
        >
        {deviceType !== "xs" && (
          <FaSearch
            className="text-slate-400 mr-1 absolute left-1.5 z-10"
            onClick={() => {
              if (searchFocus) return null

              !searchFocus
                ? document.getElementById("searchInput").focus()
                : setSearchFocus(false)
            }}
          />
          )}
          <input
            type="text"
            placeholder="Search for a Todo"
            className={`${
              deviceType === "xs" ? "pl-2 pr-[5.3rem]" : "pl-7 pr-[6.7rem] "
            } focus:outline-none focus:bg-white focus:text-black tracking-wide font-Montserrat font-medium w-full bg-gray-700 absolute left-0 rounded text-gray-400 text-sm sm:text-base py-[7px] sm:py-[5px]`}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            id="searchInput"
            value={inputValue}
            onChange={(e) =>
              setInputValue(
                e.target.value.trim().length < 1 ? "" : e.target.value
              )
            }
            onFocus={() => setSearchFocus(true)}
          />
          {inputValue.trim().length > 0 && (
            <FaTimes
              className={`crossIcon absolute ${
                deviceType === "xs" ? "right-[4.3rem]" : "right-[5.5rem] "
              } `}
              onClick={() => setInputValue("")}
            />
          )}
          {inputValue.trim().length > 0 ? (
            <Link
              to={`/?q=${inputValue}${categParam ? "&c=" + categParam : ""}`}
              className={btnStyle}
            >
              Search
            </Link>
          ) : (
            <button className={btnStyle}>Search</button>
          )}
        </div>
      </>
    )
  }


  const Button = ({ text = "New Todo", link }) =>
    link ? (
      <Link
        to={link}
        className="bg-indigo-500 hover:bg-indigo-400 active:scale-95 transition-all ease-in-out text-white rounded-md px-3 py-2 text-sm font-medium flex items-center"
      >
        <FaHome className="mr-2" />
        {text}
      </Link>
    ) : (
      <button
        className="bg-indigo-500 hover:bg-indigo-400 active:scale-95 transition-all ease-in-out text-white rounded-md px-3 py-2 text-sm font-medium flex items-center"
        onClick={currentLocation === "/" ? showTheFormFunc : null}
      >
        <FaPlus className="mr-2" />
        {text}
      </button>
    )

  const UserNav = () => (
    <>
      <button
        type="button"
        className="flex rounded-full bg-gray-800 text-sm"
        id="user-menu-button"
        aria-expanded={isOpen}
        onClick={toggleMenu}
      >
        <span className="sr-only">Open user menu</span>
        <FaRegUserCircle className="h-8 w-8 rounded-full text-slate-200" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 focus:outline-none animate-dropdown">
          <Link
            to={"/userNav?page=profile"}
            className="block px-4 py-2 text-sm text-gray-700 active:bg-gray-100"
            onClick={toggleMenu}
          >
            Your Profile
          </Link>
          <Link
            to={"/userNav?page=settings"}
            className="block px-4 py-2 text-sm text-gray-700 active:bg-gray-100"
            onClick={toggleMenu}
          >
            Settings
          </Link>
          <Link
            to="/logout"
            className="block px-4 py-2 text-sm text-gray-700 active:bg-gray-100"
            onClick={toggleMenu}
          >
            Sign out
          </Link>
        </div>
      )}
    </>
  )

  return (
    <>
      {currentLocation === "/" && <SearchBar />}
      <div
        className={`relative ${
          currentLocation === "/" ? "right-0" : "right-12 mr-2"
        }`}
      >
        {currentLocation === "/" ? (
          <Button />
        ) : (
          <Button text={"Home"} link={"/"} />
        )}
      </div>
      {currentLocation !== "/" && (
        <div className="absolute ml-3 right-0 pr-2 sm:ml-6 sm:pr-0">
          {" "}
          <UserNav />
        </div>
      )}
    </>
  )
}

export default Header
