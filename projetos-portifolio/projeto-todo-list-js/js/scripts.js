//seleção dos elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn =document.querySelector("#erase-button");
const filterBtn =document.querySelector("#filter-select");

//variavel input que será editado
let oldInputValue;

//Funções

const saveTodo = (text, done =0, save = 1) =>{
    const todo = document.createElement("div");
    todo.classList.add("todo");

const todoTitle = document.createElement("h3");
todoTitle.innerText = text
todo.appendChild(todoTitle);

// criação do botão finalizar
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)
 // criação do botão editar
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)
 // criação do botão remover
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo")
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn)


 //Utilizando dados da local storage
    if(done){
        todo.classList("done")
    }
    if(save){
        saveTodosLocalStorage({text, done: 0})
    }
 
//colocar o todo na lista geral todo-list
    todoList.appendChild(todo);
//limpar o input depois que o usuário diditar
    todoInput.value ="";
//focar novamento no input apos limpar o que o usuário digita
    todoInput.focus();
};

//abrir formulario de edição e esconder o de tarefas

const toggleForms =() =>{
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
}

//função atualizar edição da tarefa

const updateTodo =(text) =>{
    const todos =document.querySelectorAll(".todo")
    //percorrer os todos 
    todos.forEach((todo) =>{
        let todoTitle = todo.querySelector("h3")
        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText =text;
            updateTodoLocalStorage(oldInputValue, text)
        }
    })

}
//função de busca

const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo");
    //percorrer os todos
    todos.forEach((todo) => {
     let todoTitle = todo.querySelector("h3").innerText.toLowerCase(); //lowercase independete se for digitado com cpaslook
        
        const normalizedSearch = search.toLowerCase(); // normalizar a busca
        
        todo.style.display = "flex";

        if(!todoTitle.includes(normalizedSearch)){//condição de não possuir o search
        todo.style.display = "none";
    }
    
    });
};

//função filtro todos

const filterTodos = (filterValue) =>{
    const todos =document.querySelectorAll(".todo");

    switch(filterValue){
        case"all":
        todos.forEach((todo) => (todo.style.display = "flex"));
        break;
        case"done":
        todos.forEach((todo) => todo.classList.contains("done") ? todo.style.display ="flex" : todo.style.display ="none");
        break;
        case"todo":
        todos.forEach((todo) => ! todo.classList.contains("done") ? todo.style.display ="flex" : todo.style.display ="none");
        break;
        default:
            break;
    }

}

//Eventos
todoForm.addEventListener("submit",(e) =>{
        e.preventDefault();

const inputValue =todoInput.value;

if (inputValue){
    saveTodo(inputValue)
}
});

//Evento botão finalzar tarefa

document.addEventListener("click", (e)=>{
    const targetEl = e.target;
    const parentEl = targetEl.closest("div") //pegar div mais proxima no caso todo
    let todoTitle; //variavel de escopo global

    if(parentEl && parentEl.querySelector("h3")){//verificação se um elemento possui um titulo
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if(targetEl.classList.contains("finish-todo")){ //marcar como feito tarefa
        parentEl.classList.toggle("done");
        updateTodosStatusLocalStorage(todoTitle);
    }
    if(targetEl.classList.contains("remove-todo")){
        parentEl.remove(); //ecluir tarefa

        removeTodosLocalStorage(todoTitle);
    }
    if(targetEl.classList.contains("edit-todo")){
        toggleForms();//editar tarefa
        
        editInput.value = todoTitle; //editando valor do input
        oldInputValue = todoTitle;
    }
    
});

//Evento cancelar edição

cancelEditBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    toggleForms();
});

//Evento validar botão e edição

editForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    const editInputValue = editInput.value //novo valor 
    
    if(editInputValue)
        //atualizar valor editado
        updateTodo(editInputValue)

    toggleForms()
});

//evento de busca

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;

    getSearchTodos(search) //chamar a função com parametro de busca
});


//evento para habilitar botão de limpar busca

eraseBtn.addEventListener ("click", (e) =>{
    e.preventDefault() // para não enviar o formulário
    searchInput.value = ""//zerar o valor de search
    searchInput.dispatchEvent(new Event("keyup")); //voltar com os inputs
});

//evento de filtrar as tarefes

filterBtn.addEventListener("change", (e) => {
    const filterValue =e.target.value;
    
    filterTodos(filterValue);
})

//Local Storage persistindo os dados

//buscar os todos no local Storage

const getTodosLocalStorage = () =>{
    const todos = JSON.parse(localStorage.getItem("todos")) || [] 
    return todos
}

//carregando os todos
const loadTodos =() =>{
    const todos =getTodosLocalStorage();
    todos.forEach((todo) =>{
        saveTodo(todo.text,todo.done,0)
    })
}

//salvando as tarefas no local storage
const saveTodosLocalStorage = (todo) =>{
    const todos =getTodosLocalStorage();

    todos.push(todo)
    localStorage.setItem("todos", JSON.stringify(todos))
}
//removendo os todos
const removeTodosLocalStorage = (todoText) =>{
    const todos = getTodosLocalStorage();
    const filterTodos = todos.filter((todo) => todo.text !== todoText);
    localStorage.setItem("todos", JSON.stringify(filterTodos));
}

//atualizando status local storage
const updateTodosStatusLocalStorage = (todoText) =>{
    const todos = getTodosLocalStorage();
   
    todos.map((todo) => 
    todo.text === todoText ? (todo.done = !todo.done): null
);
    localStorage.setItem("todos", JSON.stringify(todos));
}
//atualizando o texto na local Storage
const updateTodoLocalStorage = (todoOldText, todoNewText ) =>{
    const todos = getTodosLocalStorage();
    
    todos.map((todo) => 
        todo.text === todoOldText ? (todo.text = todoNewText): null
);
    localStorage.setItem("todos", JSON.stringify(todos));
}
loadTodos();