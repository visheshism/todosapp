import React, { useState } from "react"
import Todo from "./Todo/Todo"
import { updateTodo } from "../TodoForm/TodoForm"
import { FaFilter } from "react-icons/fa"
import { SkeletonTodos } from "../Skeleton Animation/SkeletonAnimation"

const TodosWrapper = ({ reqs }) => {
  const {
    currentTodos,
    setCurrentTodo,
    setCurrentMode,
    setShowForm,
    todos,
    setTodos,
    loadingData,
    currentFilter,
    setCurrentFilter,
    deviceType,
    sideContent,
  } = reqs

  const handleDivClick = (todo) => {
    setCurrentTodo(todo)
    setCurrentMode("read")
    setShowForm(true)
  }

  const toggleTodoCompleted = (meIty) => {
    const activeTodo = todos.find((todo) => todo.meIty === meIty)
    updateTodo({ ...activeTodo, isCompleted: !activeTodo.isCompleted })
    setTodos(prevTodos =>
      prevTodos.map((todo) =>
        todo.meIty === meIty
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo
      )
    )
  }

  const FilterButton = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => {
      if (!loadingData) {
        setIsOpen(!isOpen)
      }
    }

    return (
      <div
        className={`relative inline-block mr-2 ${sideContent && deviceType === "xs" ? "-z-10" : ""
          }`}
      >
        <button
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 font-Manrope"
          onClick={toggleDropdown}
        >
          <FaFilter className="w-4 h-4 text-white fill-current" />
          <span>Filter</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 w-48 mt-1 bg-white rounded shadow-2xl border-2 border-slate-200 font-Lato">
            {["all", "incomplete", "completed"].map((option) => (
              <label
                className="flex items-center px-4 py-2 cursor-pointer"
                key={option}
                onClick={() => setCurrentFilter(option)}
              >
                <input
                  onChange={() => null}
                  type="checkbox"
                  className="form-checkbox text-blue-500"
                  checked={currentFilter === option}
                />
                <span className="ml-2 capitalize">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`w-full flex flex-col justify-center items-center flex-shrink py-4 -ml-2`}
    >
      <div className="my-2 max-w-[680px] flex justify-between w-full">
        <h1 className="text-left w-full text-3xl max-w-[70%] break-words font-Montserrat font-medium tracking-wide">
          {document.title}
        </h1>
        <FilterButton />
      </div>
      <ul className="w-full grid grid-cols-1 max-w-[680px] overflow-hidden pr-2">
        {loadingData ? (
          <SkeletonTodos />
        ) : currentTodos.length > 0 ? (
          currentTodos.map((todo) => (
            <Todo
              key={todo.meIty}
              todo={todo}
              toggleTodo={() => toggleTodoCompleted(todo.meIty)}
              handleDivClick={() => handleDivClick(todo)}
              deviceType={deviceType}
            />
          ))
        ) : (
          <div className="py-24 text-xl md:text-3xl lg:text-5xl text-slate-600/40 font-semibold select-none flex-grow text-center">
            No Todos found!
          </div>
        )}
      </ul>
    </div>
  )
}

export default TodosWrapper
