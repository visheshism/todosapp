import React from "react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { Link } from "react-router-dom"

const SkeletonTodo = () => {
  return (
    <li>
      <div className="p-2 mt-2 bg-white shadow-md rounded-md flex items-center w-full mb-4">
        <input
          type="checkbox"
          className="mr-4 min-h-8 min-w-8 w-8 h-8 m-4 accent-slate-600 rounded-full"
          disabled
        />

        <div className="ml-2 flex flex-col space-y-1 w-full pr-4 break-all">
          <p className="text-lg font-semibold w-[45%]">{<Skeleton />}</p>
          <p className="text-gray-600 w-[95%]">{<Skeleton count={2} />}</p>
        </div>
      </div>
    </li>
  )
}

const SkeletonCategory = ({ count = 0 }) => {
  return (
    <div
      className={`relative flex items-center justify-around my-2 py-1 bg-transparent rounded-md pl-1 pr-2`}
    >
      <Link
        className={`px-1 py-1 focus:outline-none tracking-wider text-sm max-w-[92px] min-w-[92px] break-all text-left mr-12 text-indigo-500 w=full`}
      >
        {<Skeleton />}
      </Link>
      <div
        className={`ml-6 
             bg-slate-500 text-white rounded-full h-6 w-6 flex items-center justify-center absolute right-2`}
      >
        <span className="text-xs font-medium">{count}</span>
      </div>
    </div>
  )
}

const SkeletonGroup = ({ length = 5, Component }) => {
  return (
    <>
      {Array.from({ length }, (_, index) => (
        <Component key={index} />
      ))}
    </>
  )
}

export const SkeletonTodos = () => <SkeletonGroup Component={SkeletonTodo} />
export const SkeletonCategories = () => (
  <SkeletonGroup Component={SkeletonCategory} length={6} />
)
