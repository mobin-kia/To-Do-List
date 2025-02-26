let addBtn = document.getElementById("add_btn");
let modalForm = document.getElementById("todo_form");
let todoContainer = document.getElementById("todo-container");
let todoInput = document.getElementById("todo_input");
let submit = document.getElementById("todo_submit");
let divResult = document.getElementById("no_status");
let closeModal = document.getElementById("close-modal");
let statusBox = document.querySelectorAll(".status");

let db = null;




window.addEventListener("load", () => {
    let createDB = indexedDB.open("mobin.kia DB", 16);

    createDB.onerror = () => console.error("DB not created!");

    createDB.onsuccess = (event) => {
        db = event.target.result;
        console.log("DB created!", db);
        loadTodos()
    };

    createDB.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("To-Do2")) {
            db.createObjectStore("To-Do2", { keyPath: "id" });
        }
    };
});




function addTodo() {

    let result = todoInput.value.trim();
    if (!result) return;

    let NewTodo = {
        id: Date.now(),
        Todo: result
    };

    saveTodoToDB(NewTodo);
    displayTodo(NewTodo);


    

    modalForm.classList.remove("active");
    todoContainer.style.filter = "blur(0px)";
    todoInput.value = "";
}



function saveTodoToDB(todo) {
    let transaction = db.transaction("To-Do2", "readwrite");
    let store = transaction.objectStore("To-Do2");
    store.add(todo);
}

function displayTodo(todo) {
    let closeIcon = document.createElement("span");
    closeIcon.innerHTML = "&times;";
    closeIcon.className = "close";

    let ElemResult = document.createElement("div");
    ElemResult.className = "todo";
    ElemResult.innerHTML = todo.Todo;
    ElemResult.id = "todo-" + todo.id;
    ElemResult.draggable = true; 

    ElemResult.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text", todo.id);
    });

    closeIcon.addEventListener("click", () => {
        removeTodo(todo.id);
        ElemResult.remove();
    });

    ElemResult.appendChild(closeIcon);
    divResult.appendChild(ElemResult);
}

function loadTodos() {
    let transaction = db.transaction("To-Do2", "readonly");
    let store = transaction.objectStore("To-Do2");
    let request = store.getAll();

    request.onsuccess = () => {
        request.result.forEach(todo => displayTodo(todo));
    };
}

function removeTodo(id) {
    let transaction = db.transaction("To-Do2", "readwrite");
    let store = transaction.objectStore("To-Do2");
    store.delete(id);
}

addBtn.addEventListener("click", () => {
    modalForm.classList.add("active");
    todoContainer.style.filter = "blur(3px)";
});

submit.addEventListener("click", addTodo);

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTodo();
});

closeModal.addEventListener("click", () => {
    modalForm.classList.remove("active");
    todoContainer.style.filter = "blur(0px)";
});


statusBox.forEach((box) => {
    box.addEventListener("dragover", (event) => {
        event.preventDefault(); 
    });

    box.addEventListener("drop", (event) => {
        event.preventDefault();
        let todoId = event.dataTransfer.getData("text");
        let draggedTodo = document.getElementById("todo-" + todoId);
        box.appendChild(draggedTodo);
    });
});









