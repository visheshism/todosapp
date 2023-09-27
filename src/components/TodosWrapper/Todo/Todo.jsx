import React from "react"

const Todo = ({ todo, toggleTodo, handleDivClick, deviceType }) => {
  const { title, description, isCompleted } = todo

  return (
    <li>
      <div className="p-2 mt-2 bg-white shadow-md rounded-md flex items-center w-full mb-4">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={toggleTodo}
          className="mr-4 min-h-8 min-w-8 w-8 h-8 m-4 accent-slate-600 rounded-full"
        />

        <div
          className="ml-2 flex flex-col space-y-1 w-full pr-4 break-all truncate"
          onClick={handleDivClick}
        >
          <p className="text-lg font-semibold w-full truncate">
            {title}
          </p>
          <p className="text-gray-600 w-full truncate">
            {description}
          </p>
        </div>
      </div>
    </li>
  )
}

export default Todo