import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { HiMenuAlt2 } from "react-icons/hi"
import {
  FaCheck,
  FaEdit,
  FaRegUserCircle,
  FaTimes,
  FaTrash,
} from "react-icons/fa"
import { IoIosCreate as IoCreate } from "react-icons/io"
import { SkeletonCategories } from "../Skeleton Animation/SkeletonAnimation"
import { axiosReq, handleToastify } from "../../utils"

const Sidebar = ({
  reqs: {
    setTodos,
    todosLength,
    categParam,
    location,
    categories,
    setCategories,
    setSideContent,
    deviceType,
    sideContent,
    sidebarComp,
    sidebarToggleBtn
  },
}) => {
  const navigate = useNavigate()
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    setLoadingData(true)
  }, [categories])

  useEffect(() => {
    if (loadingData) {
      setTimeout(() => setLoadingData(false), 1000)
    }
  }, [loadingData])

  const UserNav = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
      setIsOpen(!isOpen)
    }

    return (
      <div className="relative">
        <button
          type="button"
          className="flex rounded-full text-sm focus:outline-none transition-all ease-in-out shadow-lg p-1 my-2"
          id="user-menu-button"
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <span className="sr-only">Open user menu</span>
          <FaRegUserCircle className="h-8 w-8 rounded-full text-slate-600" />
        </button>

        {isOpen && (
          <div className="absolute bottom-3 left-11 z-10 w-40 origin-top-right rounded-md bg-indigo-600 text-white py-1 focus:outline-none animate-dropdown shadow-lg">
            <Link
              to={"/userNav?page=profile"}
              className="block px-4 py-2 text-sm active:text-gray-100"
              onClick={toggleMenu}
            >
              Your Profile
            </Link>
            <Link
              to={"/userNav?page=settings"}
              className="block px-4 py-2 text-sm active:text-gray-100"
              onClick={toggleMenu}
            >
              Settings
            </Link>
            <Link
              to="/logout"
              className="block px-4 py-2 text-sm active:text-gray-100"
              onClick={toggleMenu}
            >
              Sign out
            </Link>
          </div>
        )}
      </div>
    )
  }

  const CategoryList = () => {
    const HomeBtn = () => {
      const home = !categParam && location.search === ""

      return (
        <div
          className={`relative flex items-center justify-around ${home ? "bg-indigo-500  rounded-md" : "bg-transparent"
            }`}
        >
          <Link
            to="/"
            className={`px-2 py-2 focus:outline-none tracking-wider text-sm text-left mr-3 group-hover:mr-0 min-w-[92px] ${home ? " text-slate-100" : "text-indigo-500"
              }`}
            onClick={() => setSideContent(false)}
          >
            All Todos
          </Link>
          <div
            className={`ml-4 mr-1 ${home ? "text-indigo-500 bg-slate-100 " : "bg-slate-500 text-white"
              } rounded-full h-6 w-6 flex items-center justify-center`}
          >
            <span className="text-xs font-medium">
              {todosLength.all > 999 ? "99+" : todosLength.all}
            </span>
          </div>
        </div>
      )
    }

    const AddNewCategory = () => {
      const [inputMode, setInputMode] = useState(false)
      const [categN, setCategN] = useState("")

      const AbortHandler = () => {
        setCategN("")
        setInputMode(false)
      }

      const SuccessHandler = async () => {
        const req = await axiosReq("post", "/categ", { categ: categN })
        const {
          data: { success, message, categories: dbCategs },
        } = req
        handleToastify(success, message, 2500)
        if (success) {
          setCategories([...categories, categN])
        } else {
          handleToastify(
            false,
            message || "Error while creating the category, please try again.",
            5000
          )
        }
        setCategN("")
        setInputMode(false)
      }

      return (
        <div
          className={`relative min-w-full max-w-[96px] px-3 bg-slate-100 py-1 rounded-md hover:bg-slate-200 text-slate-800 group flex mb-3 mt-3`}
        >
          {!inputMode ? (
            <button
              className="flex items-center"
              onClick={() => setInputMode(true)}
            >
              <IoCreate className="text-lg mr-2" />
              <span
                className={`px-0 py-1 focus:outline-none tracking-wider text-sm  text-left mr-3 font-medium font-xs`}
              >
                Add new
              </span>
            </button>
          ) : (
            <>
              <input
                type="text"
                value={categN}
                onChange={(e) => setCategN(e.target.value)}
                className={`bg-transparent text-sm px-0.5 py-1 focus:outline-none max-w-[80px] tracking-wider border-b-2 border-transparent  `}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              <span className="flex items-center space-x-2 ml-2">
                <button className={"text-gray-500"} onClick={AbortHandler}>
                  <FaTimes />
                </button>
                <button className={"text-green-500"} onClick={SuccessHandler}>
                  <FaCheck />
                </button>
              </span>
            </>
          )}
        </div>
      )
    }

    const CategoryBtn = ({ initialText, link, count = 0, index }) => {
      const [editing, setEditing] = useState(false)
      const [text, setText] = useState(initialText)

      const currentURI =
        categParam &&
        categories.includes(categParam) &&
        link === `/${decodeURI(location.search)}`

      const handleEdit = () => {
        setEditing(true)
      }

      const handleCancel = () => {
        setEditing(false)
        setText(initialText)
      }

      const handleSave = async () => {
        if (text === initialText) {
          setEditing(false)
          setText(initialText)
          setLoadingData(false)
        } else {
          setLoadingData(true)
          const req = await axiosReq("put", "/categ", {
            categ: initialText,
            newCateg: text,
          })
          const {
            data: { success, message, categories: dbCategs },
          } = req
          handleToastify(success, message, 2500)
          if (success) {
            setCategories(
              categories.map((categ) => (categ === initialText ? text : categ))
            )



            if (categParam && categParam === initialText) {
              navigate(`/?categ=${text}`)
            }
          } else {
            setEditing(false)
            setText(initialText)
          }
          setLoadingData(false)
          setEditing(false)
        }
      }

      const handleDelete = async () => {
        const req = await axiosReq("delete", "/categ", { categ: text })

        const {
          data: { success, message, categories: dbCategs },
        } = req
        handleToastify(success, message, 2500)
        if (success) {
          const updatedCategories = [...categories]
          updatedCategories.splice(index, 1)
          setCategories(updatedCategories)

          setTodos(prevTodos => prevTodos.filter((todo) => todo.categ !== text))

        } else {
        }
      }

      return (
        <div
          className={`relative flex items-center group justify-around my-2 py-1 ${currentURI ? "bg-indigo-500" : "bg-transparent"
            } rounded-md pl-1 pr-2`}
        >
          {editing ? (
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`bg-transparent text-sm px-0.5 py-1 focus:outline-none max-w-[80px] tracking-wider border-b-2 border-transparent  ${currentURI
                ? "text-slate-100 focus:border-slate-100"
                : "focus:border-slate-400 "
                }`}
            />
          ) : (
            <Link
              to={`/?categ=${text}`}
              className={`px-1 py-1 focus:outline-none tracking-wider text-sm max-w-[92px] min-w-[92px] break-all text-left mr-12  group-hover:mr-0 ${currentURI ? "text-slate-100" : "text-indigo-500"
                }`}
              onClick={() => setSideContent(false)}
            >
              {text}
            </Link>
          )}

          {editing ? (
            <span className="invisible group-hover:visible flex items-center space-x-2 ml-2">
              <button
                onClick={handleCancel}
                className={currentURI ? "text-slate-100" : "text-gray-500"}
              >
                <FaTimes />
              </button>
              <button
                onClick={handleSave}
                className={currentURI ? "text-green-400" : "text-green-500"}
              >
                <FaCheck />
              </button>
            </span>
          ) : (
            <span className="hidden group-hover:flex items-center space-x-2 ml-2">
              <button
                onClick={handleEdit}
                className={currentURI ? "text-slate-100" : "text-gray-500"}
              >
                <FaEdit />
              </button>
              <button
                onClick={handleDelete}
                className={currentURI ? "text-red-400" : "text-red-500"}
              >
                <FaTrash />
              </button>
            </span>
          )}
          {!editing && (
            <div
              className={`ml-6 ${currentURI
                ? "text-indigo-500 bg-slate-100 "
                : "bg-slate-500 text-white"
                } rounded-full h-6 w-6 flex items-center justify-center group-hover:hidden absolute right-2`}
            >
              <span className="text-xs font-medium">{count}</span>
            </div>
          )}
        </div>
      )
    }

    return (
      <div
        className={`bg-white px-4 pt-4 max-h-[100%] rounded-[1.2rem] overflow-y-scroll categList shadow-xl border-[1px] border-slate-200 ${["xs", "sm"].includes(deviceType) && "absolute"
          }`}
      >
        {loadingData ? (
          <SkeletonCategories />
        ) : (
          <>
            <HomeBtn />
            {categories.map((category, index) => (
              <CategoryBtn
                initialText={category}
                link={`/?categ=${category}`}
                index={index}
                key={category + index}
                count={todosLength[category]}
              />
            ))}
            <AddNewCategory />
          </>
        )}
      </div>
    )
  }

  return (
    <div className="bg-transparent px-2 flex flex-shrink-0 ml-2 my-2 py-2">
      <div className="p-2 pt-4 flex flex-col bg-white justify-between rounded-[2rem] shadow-xl border-[1px] border-slate-200 z-10 mr-3">
        <button
          className="my-5 hover:bg-indigo-800 hover:text-white focus:outline-none p-2 rounded-xl text-xl transition-all ease-in-out shadow-md focus:ring focus:ring-indigo-600 focus:ring-offset-white focus:ring-offset-2"
          onClick={() => setSideContent(!sideContent)} ref={sidebarToggleBtn}
        >
          <HiMenuAlt2 />
        </button>

        <UserNav />
      </div>
      {sideContent && (
        <div
          className={`transition-all -translate-x-[120%] opacity-0 ${!sideContent ? "" : "toRight"} px-0 bg-transparent ease-in-out py-1.5  ${!["xs", "sm"].includes(deviceType) && "mr-1"}`} ref={sidebarComp}
        >
          {<CategoryList />}
        </div>
      )}
    </div>
  )
}

export default Sidebar
