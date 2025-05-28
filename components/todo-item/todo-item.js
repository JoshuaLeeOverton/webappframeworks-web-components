const template = document.createElement("template")

template.innerHTML = `
  <style>
    #todo-container {
      display: flex;
      flex-direction: row;
      width: 100%;
      padding: 8px;
      justify-content: space-between;
    }
  </style>
  <div id="todo-container">
    <span id="todo-title"></span>
    <span id="todo-date"></span>
    <div id="todo-actions">
      <button id="todo-actions-edit">
        Edit
      </button>
      <button id="todo-actions-delete">
        Delete
      </button>
    </div>
  </div>
`

class TodoItem extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: "open" })
    shadow.append(template.content.cloneNode(true))

    this.todoTitle = shadow.getElementById("todo-title")
    this.todoDate = shadow.getElementById("todo-date")
    this.todoEditButton = shadow.getElementById("todo-actions-edit")
    this.todoDeleteButton = shadow.getElementById("todo-actions-delete")
  }

  connectedCallback() {
    // Store bound handlers for proper removal
    this._handleEditClick = () => this._handleButtonClick("edit")
    this._handleDeleteClick = () => this._handleButtonClick("delete")
    this.todoEditButton.addEventListener("click", this._handleEditClick)
    this.todoDeleteButton.addEventListener("click", this._handleDeleteClick)
  }

  _handleButtonClick(action) {
    console.log(`Internal Button Click ${action}`)

    // Dispatch a custom event for parent listeners
    this.dispatchEvent(
      new CustomEvent("onClick", {
        detail: action,
        bubbles: true,
        composed: true
      })
    )
  }

  disconnectedCallback() {
    // Remove event listeners to prevent memory leaks
    this.todoEditButton.removeEventListener("click", this._handleEditClick)
    this.todoDeleteButton.removeEventListener("click", this._handleDeleteClick)
    console.log("disconnected")
  }

  static get observedAttributes() {
    return ["title", "date"]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title") {
      this.setTitle(newValue)
    }

    if (name === "date") {
      this.setDate(newValue)
    }
  }

  setTitle(value) {
    this.todoTitle.innerHTML = value
  }

  setDate(value) {
    this.todoDate.innerHTML = value
  }
}

customElements.define("todo-item", TodoItem)

