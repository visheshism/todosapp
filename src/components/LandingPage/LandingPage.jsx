import React from "react"
import Bg from "../../images/landingPageBg.jpg"
import { Link } from "react-router-dom"

const LandingPage = () => {
  document.title = "Todos App"

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] -mt-16">
        <img
          src={Bg}
          alt="Background"
          className="absolute object-cover blur-sm w-full h-full opacity-75 -z-20 inset-0"
        />
        <img
          src={Bg}
          alt="Background"
          className="absolute object-contain w-full h-full opacity-75 -z-10 backdrop-blur-md inset-0"
        />

        <h1 className="text-2xl sm:text-4xl font-bold mt-2 mb-6 text-white px-4">
          TodosApp - Master Your Day with Ease
        </h1>
        <h2 className="text-sm sm:text-lg text-cyan-400 sm:text-orange-300 mb-8 font-Montserrat px-2.5 text-center">
          Get things done, achieve your goals, and enjoy peace of mind.
        </h2>
        <div className="border-t border-gray-400 w-56 md:mb-28 mb-6 sm:mb-10"></div>
        <div className="flex flex-col-reverse md:flex-col">
          <p className="text-center text-rose-600 sm:text-rose-800 mt-2 text-lg sm:text-2xl font-semibold font-sans px-1.5 sm:mb-4 mb-2">
            Sign up today and take control of your tasks!
          </p>

          <Link
            to={"/signup"}
            className="mx-auto bottom-[31%] sm:bottom-[44%] lg:bottom-[26%] bg-blue-500 hover:bg-blue-600 text-white font-semibold font-Montserrat tracking-wide py-2 sm:py-3 px-3 sm:px-5 mt-2 sm:mt-6 md:mt-8 rounded text-sm sm:text-base md:text-lg flex"
          >
            Get Started
          </Link>
        </div>
      </div>
    </>
  )
}

export default LandingPage
