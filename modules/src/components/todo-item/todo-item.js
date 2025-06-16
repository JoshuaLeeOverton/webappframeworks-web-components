const template = document.createElement("template")

const buttonInitialState = `
  <button id="todo-actions-edit">
    Edit
  </button>
  <button id="todo-actions-delete">
    Delete
  </button>
`

const buttonEditState = `
  <button id="todo-actions-save">
    Save
  </button>
  <button id="todo-actions-cancel">
    Cancel
  </button>
`

template.innerHTML = `
  <style>
    #todo-container {
      display: flex;
      flex-direction: row;
      width: 100%;
      padding: 8px;
      justify-content: space-between;
    }

    #todo-info-container {
      display: flex;
    }

    #todo-date {
      padding-right: 10px;
      margin-left: 25px;
    }
  </style>
  <div id="todo-container">
    <div id="todo-input-container"> 
      <span id="todo-title"></span>
    </div>
    <div id="todo-info-container">
      <span id="todo-date"></span>
      <div id="todo-actions">
        ${buttonInitialState}
      </div>
    </div>
  </div>
`

export default class TodoItem extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: "open" })
    shadow.append(template.content.cloneNode(true))

    this.todoTitle = shadow.getElementById("todo-title")
    this.todoDate = shadow.getElementById("todo-date")
    this.todoEditButton = shadow.getElementById("todo-actions-edit")
    this.todoDeleteButton = shadow.getElementById("todo-actions-delete")
    this.todoActions = shadow.getElementById("todo-actions")
    this._isEditMode = false
    this._currentTitle = ""

    this._externalOnClickHandler = null
  }

  connectedCallback() {
    // Store bound handlers for proper removal
    this._handleEditClick = () => this._handleEditButtonClick()
    this._handleDeleteClick = () => this._handleButtonClick("delete")
    this.todoEditButton.addEventListener("click", this._handleEditClick)
    this.todoDeleteButton.addEventListener("click", this._handleDeleteClick)
  }

  _stopEvent(e) {
    e.stopPropagation()
  }

  _handleEditButtonClick() {
    this._setEditState(true)
  }

  _setEditState(isEdit) {
    this.todoActions.innerHTML = isEdit ? buttonEditState : buttonInitialState
    this._isEditMode = isEdit

    // Swap title span with input in edit mode
    if (isEdit) {
      this._currentTitle = this.todoTitle.textContent
      const input = document.createElement("input")
      input.type = "text"
      input.value = this._currentTitle
      input.id = "todo-title-input"
      this.todoTitle.replaceWith(input)
      this.todoTitleInput = input
    } else {
      // Swap input back to span
      if (this.todoTitleInput) {
        const span = document.createElement("span")
        span.id = "todo-title"
        span.textContent = this.todoTitleInput.value
        this.todoTitleInput.replaceWith(span)
        this.todoTitle = span
      }
    }

    if (isEdit) {
      const todoSaveButton = this.shadowRoot.getElementById("todo-actions-save")
      const todoCancelButton = this.shadowRoot.getElementById(
        "todo-actions-cancel"
      )
      todoSaveButton.addEventListener("click", () => {
        this._setEditState(false)
        this._handleButtonClick("update", {
          title: this.todoTitleInput.value,
          date: this.todoDate.innerText
        })
      })
      todoCancelButton.addEventListener("click", () =>
        this._setEditState(false)
      )
    } else {
      const todoEditButton = this.shadowRoot.getElementById("todo-actions-edit")
      const todoDeleteButton = this.shadowRoot.getElementById(
        "todo-actions-delete"
      )
      todoEditButton.addEventListener("click", this._handleEditClick)
      todoDeleteButton.addEventListener("click", this._handleDeleteClick)
    }
  }

  _handleButtonClick(action, payload = {}) {
    this.dispatchEvent(
      new CustomEvent("todo-click", {
        // Changed from "onClick" to "itemAction" for clarity
        detail: { action, id: this.id, payload }, // This will be "edit" or "delete"
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
    return ["title", "date", "onClick"]
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

