import React, { useEffect, useState } from "react"
import { axiosReq, handleToastify } from "../../utils"
import { toast } from "react-hot-toast"

export const updateTodo = async (updatedTodo, setLoading) => {
  const res = await axiosReq(
    "put",
    "/todo",
    {
      updatedTodo: { ...updatedTodo, Ity: updatedTodo.meIty },
    },
    setLoading
  )

  if (setLoading) {
    const {
      data: { success },
    } = res

    toast.dismiss()
    handleToastify(success, "Todo has been updated.", 2500)
  }
  return res
}

const TodoForm = ({ reqs }) => {
  const {
    todos,
    setTodos,
    currentTodo,
    setCurrentTodo,
    categories,
    categParam,
    showForm,
    setShowForm,
    setLoading,
    currentMode: mode,
    setCurrentMode,
    deviceType,
    isAdmin
  } = reqs

  const {
    title: Title = "",
    description: Desc = "",
    categ: selectedOpt = "",
  } = currentTodo

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedOption, setSelectedOption] = useState("")

  const [EditingMode, setEditingMode] = useState(false)

  const handleCancel = () => {
    if (mode === "read") {
      setEditingMode(false)
      setTitle(Title)
      setDescription(Desc)
      setSelectedOption(selectedOpt)
    } else {
      setTitle("")
      setDescription("")
      setSelectedOption("")
    }
    if (!EditingMode) {
      setShowForm(false)
      setCurrentMode("create")
      setCurrentTodo({})
    }
  }

  const handleSave = async () => {
    const res = await axiosReq(
      "post",
      "/todo",
      {
        title,
        description,
        categ: !selectedOption ? " " : selectedOption,
      },

      setLoading
    )

    const {
      data: { success, message, todo },
    } = res

    toast.dismiss()
    if (success) {
      handleToastify(res.data.success, "Todo has been created.", 2500)

      setTodos([{ ...todo }, ...todos])
    } else {
      handleToastify(
        false,
        message || "Error while creating the Todo, please try again.",
        2500
      )
    }

    setShowForm(false)
    setTitle("")
    setDescription("")
    setSelectedOption(categParam && categories.includes(categParam) ? categParam : "")
  }

  const handleUpdate = async () => {
    if (
      title !== Title ||
      description !== Desc ||
      selectedOption !== selectedOpt
    ) {
      const req = await updateTodo(
        { ...currentTodo, title, description, categ: selectedOption },
        setLoading
      )
      if (req.data.success) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.meIty === currentTodo.meIty
              ? { ...todo, title, description, categ: selectedOption }
              : todo
          )
        )
        setCurrentTodo({
          ...currentTodo,
          title,
          description,
          categ: selectedOption,
        })
      } else {
        setTitle(Title)
        setDescription(Desc)
        setSelectedOption(selectedOpt)
        handleToastify(
          false,
          req.message || "Error while updating Todo, please try again.",
          2500
        )
      }
    }
    setEditingMode(false)
  }

  const handleEdit = () => {
    setEditingMode(true)
  }

  const handleDelete = async () => {
    const res = await axiosReq(
      "delete",
      "/todo",
      {
        Ity: currentTodo.meIty,
      },

      setLoading
    )
    const {
      data: { success, message },
    } = res

    toast.dismiss()
    if (success) {
      handleToastify(res.data.success, "Todo has been deleted.", 2500)
      setTodos(todos.filter((todo) => todo.meIty !== currentTodo.meIty))
    } else {
      handleToastify(
        false,
        message || "Error while deleting Todo, please try again.",
        2500
      )
    }
    setCurrentTodo({})
    setCurrentMode("create")
    setShowForm(false)
    setTitle("")
    setDescription("")
    setSelectedOption("")
  }

  const handleChangeOption = (e) => {
    setSelectedOption(e.target.value)
  }
  useEffect(() => {
    if (mode === "read") {
      setTitle(Title)
      setDescription(Desc)
      setSelectedOption(selectedOpt)
    } else {
      setTitle("")
      setDescription("")
      setSelectedOption(
        categParam && categories.includes(categParam) ? categParam : ""
      )
    }
  }, [mode, categParam, categories])

  return (
    showForm && (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="relative bg-white p-4 rounded min-w-[320px] lg:w-[360px] 2xl:w-[380px]">
              <div className="absolute inset-0 bg-gray-300 opacity-25 z-[-1]" />
              <h2 className="text-lg font-semibold mb-4">
                {mode === "create" ? "Create Todo" : "Todo"}
              </h2>
              <div>
                <label htmlFor="title" className="block mb-2">
                  Title:
                </label>
                {!EditingMode && mode !== "create" ? (
                  <textarea
                    rows={Math.ceil(title.length / (window.innerWidth >= 1536 ? 39 : ["xs", "sm", "md"].includes(deviceType) ? 32 : 35))}
                    value={title}
                    maxLength={isAdmin ? 120 : 80}
                    readOnly
                    className={`resize-none w-full border border-gray-300 px-3 py-2 rounded mb-4 read-only:border-red-400 focus:outline-none break-all font-Manrope`}
                    spellCheck="false"
                    autoComplete="off"
                    autoCorrect="off"
                  />
                ) : (
                  <input
                    type="text"
                    value={title}
                    readOnly={
                      mode === "read" && !EditingMode ? "readonly" : null
                    }
                    onChange={(e) =>
                      setTitle(
                        e.target.value.trim().length < 1 ? "" : e.target.value
                      )
                    }
                    maxLength={isAdmin ? 120 : 80}
                    className={`border border-gray-300 px-3 py-2 rounded mb-4 w-full read-only:border-red-400 font-Manrope ${EditingMode
                        ? "focus:outline-slate-500"
                        : "focus:outline-none"
                      }`}
                    spellCheck="false"
                    autoComplete="off"
                    autoCorrect="off"
                  />
                )}
                {(mode === "create" || EditingMode) && (
                  <span className="flex justify-end text-sm -mt-4">
                    {title.length}/{isAdmin ? '120' : '80'}
                  </span>
                )}
              </div>

              {(EditingMode || mode === "create" || description.length > 0) && (
                <div>
                  <label htmlFor="description" className="block mb-2">
                    Description:
                  </label>
                  <textarea
                    rows={
                      EditingMode || mode === "create" || description.length > 155
                        ? 6
                        : Math.ceil(description.length / 22) + 1
                    }
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value.trim().length < 1 ? "" : e.target.value
                      )
                    }
                    maxLength={isAdmin ? 700 : 400}
                    readOnly={mode === "read" && !EditingMode ? "readonly" : null}
                    className={`resize-none w-full border border-gray-300 px-3 py-2 rounded mb-4 read-only:border-green-400 break-all font-Manrope customScroller ${EditingMode
                        ? "focus:outline-slate-500"
                        : "focus:outline-none"
                      }`}
                    spellCheck="false"
                    autoComplete="off"
                    autoCorrect="off"
                  />
                  {(mode === "create" || EditingMode) && (
                    <span className="flex justify-end text-sm -mt-4">
                      {description.length}/{isAdmin ? '700' : '400'}
                    </span>
                  )}
                </div>
              )}
              <div>
                <label htmlFor="option" className="block mb-2">
                  Category:
                </label>
                <select
                  value={selectedOption}
                  onChange={handleChangeOption}
                  disabled={
                    (mode === "read" && !EditingMode) ||
                    title.length < 1
                  }
                  className="border border-gray-300 px-3 py-2 rounded mb-4 w-full disabled:text-black font-Manrope focus:outline-slate-500"
                >
                  <option value=" " defaultChecked>
                    All
                  </option>
                  {categories.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 font-Lato">
                {mode === "create" ? (
                  <button
                    onClick={handleSave}
                    disabled={!title.length > 0}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Create Todo
                  </button>
                ) : (
                  <>
                    <button
                      onClick={EditingMode ? handleUpdate : handleEdit}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      {EditingMode ? "Save" : "Edit"}
                    </button>
                    {!EditingMode && (
                      <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  {mode === "read" && !EditingMode ? "Close" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  )
}

export default TodoForm
