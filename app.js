const displayTasks = document.querySelector(".display-tasks");
const newTaskBtn = document.querySelector(".new-task-btn");
const modalContainer = document.querySelector(".modal-container");
const cancelBtn = document.querySelector("#cancel-btn");
const submitBtn = document.querySelector("#submit-btn");
const saveBtn = document.querySelector("#save-btn");
let inpTitle = document.querySelector("#inp-title");
let inpDescription = document.querySelector("#inp-description");
let inpDate = document.querySelector("#inp-date");
let inpPriority = document.getElementsByName("priority");

let taskTitle;
let taskDescription;
let taskDate;
let taskPriority;
let newTask;
let tasks;
// Tasks Data
window.addEventListener("DOMContentLoaded", checkStorage);

function checkStorage() {
  if (localStorage.dbfunc !== undefined) {
    tasks = JSON.parse(localStorage.getItem("dbfunc"));
    createTaskCards(tasks);
  } else {
    tasks = [
      {
        title: "Title",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, nemo. Non assumenda recusandae nam vel a sed, enim repudiandae voluptatem.",
        priority: "High",
        date: "2023-01-01",
        status: false,
      },
    ];

    createTaskCards(tasks);
  }
}

// Create and display HTML using an array of objects

function createTaskCards(listOfTasks) {
  cardsHtml = listOfTasks.map((task) => {
    return `<div class="task-card">
        <div class="top">
          <p id="priority">Priority: ${task.priority}</p>
          <p id="date">Due Date: ${task.date}</p>
        </div>
        <h3 id="title">${task.title}</h3>
        <p id="description">
          ${task.description}
        </p>
        <div class="bottom">
          <div class="checkbox">
            <input
              type="checkbox"
              id="status"
              name="status"
              value="status"
              data-bubble="marker-btn"
              data-index=${tasks.indexOf(task)}
              ${task.status ? "checked" : ""}
            />
            <p> ${task.status ? "Complete" : "Incomplete"}<p>
          </div>
          <div class="buttons">
            <button data-index= class="edit-btn">
              <i
              data-index=${tasks.indexOf(task)} data-bubble="edit-btn"
                class="fa-regular fa-pen-to-square"
                style="color: #343946"
              ></i>
            </button>
            <button data-index= class="del-btn">
              <i data-index=${tasks.indexOf(
                task
              )} data-bubble="del-btn" class="fa-regular fa-trash-can" style="color: #343946"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  });
  cardsHtml = cardsHtml.join("");
  displayTasks.innerHTML = cardsHtml;
}

// Open Modal

newTaskBtn.addEventListener("click", openModal);

function openModal() {
  modalContainer.classList.add("active");
}

// Close Modal

cancelBtn.addEventListener("click", closeModal);

function closeModal() {
  modalContainer.classList.remove("active");
}

// Get user inputs

function getUserInputs() {
  taskTitle = inpTitle.value;
  taskDescription = inpDescription.value;
  taskDate = inpDate.value;
  taskPriority = "";

  inpPriority.forEach((radio) => {
    if (radio.checked) {
      taskPriority = radio.value;
    }
  });
}

// Transfor input to object

function transformToObject() {
  newTask = {
    title: taskTitle,
    description: taskDescription,
    priority: taskPriority,
    date: taskDate,
    status: false,
  };
}

// push data to file storage
function setItensDB() {
  localStorage.setItem("dbfunc", JSON.stringify(tasks));
}

function pushObjectToArray(taskName) {
  tasks.push(taskName);
  setItensDB();
}

// reset input values

function resetValues() {
  taskTitle = "";
  taskDescription = "";
  taskDate = "";
  taskPriority = "";
  inpTitle.value = "";
  inpDescription.value = "";
  inpDate.value = "";
  inpPriority.forEach((radio) => {
    radio.checked ? (radio.checked = false) : (radio.checked = false);
  });
}

// function submit new task

function submitNewTask() {
  if (inpTitle.value && inpDescription.value && inpDate.value) {
    getUserInputs();
    transformToObject();
    pushObjectToArray(newTask);
    createTaskCards(tasks);
    resetValues();
    closeModal();
  } else {
    alert("All fields required!");
  }
}

submitBtn.addEventListener("click", submitNewTask);

// edit task, delete, checkbox

displayTasks.addEventListener("click", searchButton);

function searchButton(e) {
  if (e.target.dataset.bubble === "edit-btn") {
    openModal();
    loadForEdit(e.target.dataset.index);
    switchBtns(e.target.dataset.index);
  } else if (e.target.dataset.bubble === "del-btn") {
    let delIndex = e.target.dataset.index;
    tasks.splice(delIndex, 1);
    createTaskCards(tasks);
    setItensDB();
  } else if (e.target.dataset.bubble === "marker-btn") {
    let checkIndex = e.target.dataset.index;
    tasks[checkIndex].status = !tasks[checkIndex].status;
    createTaskCards(tasks);
    setItensDB();
  }
}

// Load for edit
let editIndex = "";
function loadForEdit(numIndex) {
  inpTitle.value = tasks[numIndex].title;
  inpDescription.value = tasks[numIndex].description;
  inpDate.value = tasks[numIndex].date;
  inpPriority.value = tasks[numIndex].priority;
  editIndex = numIndex;
}

//switch buttons

function switchBtns(refIndex) {
  submitBtn.style.display = "none";
  cancelBtn.style.display = "none";
  saveBtn.style.display = "block";
  saveBtn.dataset.indexRef = refIndex;
}

// reverse switchBtns

function reverseSwitchBtns() {
  submitBtn.style.display = "block";
  cancelBtn.style.display = "block";
  saveBtn.style.display = "none ";
  saveBtn.dataset.indexRef = "";
}

// Save Btn

saveBtn.addEventListener("click", saveEdit);

function saveEdit(e) {
  const indexofArray = e.currentTarget.dataset.indexRef;
  getUserInputs();
  transformToObject();
  tasks[indexofArray].title = newTask.title;
  tasks[indexofArray].description = newTask.description;
  tasks[indexofArray].date = newTask.date;
  tasks[indexofArray].priority = newTask.priority;
  createTaskCards(tasks);
  reverseSwitchBtns();
  resetValues();
  closeModal();
}
