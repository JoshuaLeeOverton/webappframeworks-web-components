import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import { TodoItem } from "../modules/src/index"
import "./App.css"
import { useEffect, useRef } from "react"
import { useRequest } from "./hooks/useRequest"
import { getTodos } from "./handlers/todos"

const handleTodoClick = (e) => {
  // e.target is the <todo-item> that dispatched the event
  const title = e.target.getAttribute("title")
  const action = e.detail // if you dispatch detail from your custom event
  console.log("Custom todo-click event:", { title, action, event: e })
}

function App() {
  const cardRef = useRef(null)
  // [{id: 1, todo: 'one'},{id: 1, todo: 'one'}}]
  const { data, loading, error, refetch } = useRequest(
    import.meta.env.VITE_TODO_API_URL,
    { method: "get" },
    {},
    {},
    getTodos
  )

  useEffect(() => {
    const card = cardRef.current
    if (card) {
      card.addEventListener("todo-click", handleTodoClick)
    }
    return () => {
      if (card) {
        card.removeEventListener("todo-click", handleTodoClick)
      }
    }
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card" ref={cardRef}>
        {loading ? (
          <p>loading...</p>
        ) : error ? (
          <p>error encountered</p>
        ) : (
          <>
            {data &&
              Array.isArray &&
              data.map(({ id, title, createdAt }) => (
                <todo-item id={id} title={title} date={createdAt}></todo-item>
              ))}
          </>
        )}
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

