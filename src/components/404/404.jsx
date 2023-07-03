import React from "react"
import { Link } from "react-router-dom"
import "./404.css"

const NotFound = () => {
  return (
    <div className="absolute inset-0 bg-black/95 items-center justify-center flex flex-col gap-2 -z-10 backdrop-blur-xl">
      <h1 className="select-none text-[11em] text-white font-mono animate-pulse ">
        404
      </h1>
      <span className="text-yellow-400 text-lg sm:text-2xl md:text-3xl -mt-5 font-Belanosima">
        Page Not Found
      </span>
      <p className="text-white pt-4 font-Ysabeau tracking-wide">
        The page you're trying to reach doesn't exist.
      </p>
      <Link
        className="bg-violet-600 hover:bg-opacity-90 text-white px-3 py-1.5 rounded mt-4 active:ring-white/60 active:ring"
        to={"/"}
      >
        Visit Homepage
      </Link>
    </div>
  )
}

export default NotFound
