const todo_page = document.querySelector(".ToDo");
const TODO_FORM = document.querySelector(".todo_form");
const TODO_INPUT = document.querySelector(".input_todo");
const activeList = document.querySelector(".active_list");
const TODO_BUTTON = document.querySelector(".button");
const inActiveList = document.querySelector(".inActive_list");
const SPAN_INACTIVE = document.querySelector(".span_inActive");

const LOCAL_STORAGE_ACTIVE_LISTS = "active.lists";
const LOCAL_STORAGE_INACTIVE_LISTS = "inActive.lists";

let activeLists =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_ACTIVE_LISTS)) || [];
let inActiveLists =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_INACTIVE_LISTS)) || [];

TODO_FORM.addEventListener("submit", (event) => {
  // регистрация происшествия отправка формы
  event.preventDefault();

  const value = TODO_INPUT.value;

  if (value.trim() !== "") {
    const todo = createTodo(value); //==listName
    activeLists.push(todo); // ==list
    save_render();
  }

  TODO_INPUT.value = "";
  TODO_INPUT.focus();
});

//Обьект в activeLists
const createTodo = (value) => ({
  value,
  id: Date.now().toString(),
  active: false,
}); ///////////////// id тут

// Кнопка в листе
activeList.addEventListener("mouseup", (event) => {
  //регистрация нажатия мыши
  const btnType = event.target.dataset.btn;
  const id = event.target.dataset.todoId; //listId

  if (btnType === "delete") {
    activeLists = activeLists.filter((todo) => todo.id !== id);
    save_render();
  } else if (btnType === "check") {
    const checkItem = activeLists.find((todo) => todo.id === id);

    activeLists = activeLists.filter((todo) => todo.id !== id);
    inActiveLists.push(checkItem);
    save_render();
  }
});

//Кнопка в листе вторая
inActiveList.addEventListener("mouseup", (event) => {
  //регистрация нажатия мыши
  const btnType = event.target.dataset.btn;
  const id = event.target.dataset.todoId; //listId

  if (btnType === "delete") {
    inActiveLists = inActiveLists.filter((todo) => todo.id !== id);
    save_render();
  } else if (btnType === "remove") {
    const checkItem = inActiveLists.find((todo) => todo.id === id);
    inActiveLists = inActiveLists.filter((todo) => todo.id !== id);
    activeLists.unshift(checkItem);
    save_render();
  }
});

activeList.addEventListener("dblclick", function edit(event) {
  const li = event.target.parentNode; // даблклик по родительской ноде
  console.log(li);
  if (event.target.parentNode.tagName.toLowerCase() === "li") {
    // возврат тега по клику равен ли
    const id = event.target.parentNode.dataset.todoId; // при даблклике  мы перебираем ли список . находим нажатый и запускаем функцию
    activeLists.forEach((todo) => {
      if (todo.id === id) {
        editTodo(li, id, todo);
      }
    });
    activeList.removeEventListener("dblclick", edit); // если не находим нужный ид . то удаляем событие которое нужно отменить и его функция не работает
  }
  activeList.addEventListener("dblclick", edit); // запуск функции
});

function editTodo(li, id, todo) {
  // функция принимает и изменяет ли. ид(после изменения получаем новый ид). получает туду
  const input = document.createElement("input"); // создает инпут для изменения текста(текст внутри инпут)
  li.classList.add("edit"); // добавляем в ли класс едит
  li.appendChild(input); //добавляем в конец списка ли(в сам ли )
  input.value = innerText = todo.value; // получает тексоое содержимое элемента
  input.focus();
  input.setAttribute("spellcheck", false); // изменение атрибуда инпут (проверка орфографии) на фалс
  input.addEventListener("blur", (event) => {
    // если мы переключаемся и инпута
    if (input.getAttribute("flag") !== "1") {
      // если активный true(1) или не активный false (0)
      editDone(li, todo, input, id);
    }
  });

  input.addEventListener("keydown", (event) => {
    // событие нажания клавиш энтер и ескейп
    input.setAttribute("flag", "1");
    if (event.keyCode === 13) {
      editDone(li, todo, input, id);
    } else if (event.keyCode === 27) {
      li.classList.remove("edit"); // если нажат ескейп то удаляем у ли класс едит и ребенка инпут
      li.removeChild(input);
      save_render();
    }
    console.log(input);
    input.removeAttribute("flag"); // удаляет у инпут атрибут активности
  });
}

function editDone(li, todo, input, id) {
  // удаление пробелов после редактирования.
  if (input.value.trim() === "") {
    activeLists = activeLists.filter((todo) => todo.id !== id);
  }
  li.classList.remove("edit");
  todo.value = input.value.trim(); /////////////////////////////////////////CПРОСИТЬ
  li.removeChild(input);
  save_render();
}

SPAN_INACTIVE.addEventListener("click", (event) => {
  // показать неактивный список
  let pressed = event.target.getAttribute("aria-pressed") === "true";
  event.target.setAttribute("aria-pressed", String(!pressed)); // нажато ли смотреть список. поверить нажато ли
  checkPressed(pressed);
});

function checkPressed(pressed) {
  const arrow = SPAN_INACTIVE.querySelector(".arrowDown");

  if (pressed) {
    arrow.classList.add("open");
    inActiveList.style.display = "block"; // если нажато(true) то список открывается. если убирается опен то дисплей убирается
  } else {
    arrow.classList.remove("open");
    inActiveList.style.display = "none";
  }
}

//Создание листа с тестом и кнопками каждый раз
const render = () => {
  clearElement(activeList);
  renderEmpty();
  renderInActive();
  renderListCount();

  activeLists.forEach((todo) => {
    const listElement = document.createElement("li"); // сам ли
    const todoDiv = document.createElement("div"); //див с текстом и кнопками
    todoDiv.classList.add("view");

    const btnTodoCheck = document.createElement("button");
    btnTodoCheck.dataset.btn = "check"; //
    btnTodoCheck.dataset.todoId = todo.id; //////////////////////////////////////
    btnTodoCheck.classList.add("buttonList", "check");
    btnTodoCheck.innerHTML = `
    <svg data-btn='check' data-todo-id = '${todo.id}' viewBox="0 0 24 24" height="24" width="24">
       <path data-btn='check' data-todo-id='${todo.id}' d="M0 0h24v24H0z" fill="none" />
       <path data-btn='check' data-todo-id='${todo.id}' d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
    `;

    const btnTodoDelete = document.createElement("button");
    btnTodoDelete.dataset.btn = "delete";
    btnTodoDelete.dataset.todoId = todo.id; /////////////////////////////////////
    btnTodoDelete.classList.add("buttonList", "delete");
    btnTodoDelete.innerHTML = `
      <svg data-btn='delete' data-todo-id='${todo.id}' viewBox="0 0 24 24" height="24" width="24">
         <path data-btn='delete' data-todo-id='${todo.id}' d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
         <path data-btn='delete' data-todo-id='${todo.id}' d="M0 0h24v24H0z" fill="none" />
      </svg>
      `;

    listElement.dataset.todoId = todo.id;
    listElement.appendChild(todoDiv);

    todoDiv.innerText = todo.value;

    listElement.appendChild(btnTodoCheck);
    listElement.appendChild(btnTodoDelete);

    activeList.appendChild(listElement);
  });

  const activeListSection = todo_page.querySelector(".active_list_section");
  if (activeLists.length === 0) {
    activeListSection.style.display = "none";
  } else {
    activeListSection.style.display = "";
  }
};

function renderInActive() {
  clearElement(inActiveList);

  console.log(inActiveLists);

  inActiveLists.forEach((todo) => {
    const listElement = document.createElement("li"); // сам ли
    const todoDiv = document.createElement("div"); //див с текстом и кнопками
    todoDiv.classList.add("view");

    const btnTodoRemove = document.createElement("button");
    btnTodoRemove.dataset.btn = "remove";
    btnTodoRemove.dataset.todoId = todo.id;
    btnTodoRemove.classList.add("buttonList", "remove");
    btnTodoRemove.innerHTML = `
    <svg data-btn='remove' data-todo-id = '${todo.id}' viewBox="0 0 24 24" height="24" width="24">
       <path data-btn='remove' data-todo-id='${todo.id}' d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
       <path data-btn='remove' data-todo-id='${todo.id}' d="M0 0h24v24H0z" fill="none" />
    </svg>
    `;

    const btnTodoDelete = document.createElement("button");
    btnTodoDelete.dataset.btn = "delete";
    btnTodoDelete.dataset.todoId = todo.id;
    btnTodoDelete.classList.add("buttonList", "delete");
    btnTodoDelete.innerHTML = `
      <svg data-btn='delete' data-todo-id='${todo.id}' viewBox="0 0 24 24" height="24" width="24">
         <path data-btn='delete' data-todo-id='${todo.id}' d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
         <path data-btn='delete' data-todo-id='${todo.id}' d="M0 0h24v24H0z" fill="none" />
      </svg>
      `;

    listElement.dataset.todoId = todo.id;
    listElement.appendChild(todoDiv);

    todoDiv.innerText = todo.value;

    listElement.appendChild(btnTodoRemove);
    listElement.appendChild(btnTodoDelete);

    // todoItem.textContent = todo.value;
    inActiveList.appendChild(listElement);
  });
}

function renderListCount() {
  const taskCount = inActiveLists.length;
  const inActiveListSection = document.querySelector(".inActive_list_section");

  if (taskCount) {
    inActiveListSection.style.display = "block";

    SPAN_INACTIVE.innerHTML = ` ${taskCount} ticked<svg class="arrowDown" viewBox="0 0 24 24" height="24" width="24">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    <path d="M0 0h24v24H0V0z" fill="none" />
   </svg>
   `;

    const buttonMunu = document.createElement("button");
    buttonMunu.classList.add("inActive_list_menu");
    buttonMunu.setAttribute("title", "Delete ticked lists");
    buttonMunu.innerHTML = `
   <svg viewBox="0 0 24 24" width='24' height='24'>
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
   </svg>
   `;

    SPAN_INACTIVE.appendChild(buttonMunu);
    buttonMunu.addEventListener("mouseup", (event) => {
      event.stopPropagation();
      deleteAllInActive();
    });
  } else {
    inActiveListSection.style.display = "none";
    inActiveList.style.display = "none";
    SPAN_INACTIVE.innerHTML = "";
  }
}

function renderEmpty() {
  const emptyList = todo_page.querySelector("[data-empty]");

  const emptyImg = document.createElement("div");
  emptyImg.classList.add("empty_list_img");
  emptyImg.innerHTML = `
  <svg viewBox="0 0 24 24" width='72' height='72'>
     <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
     <path d="M0 0h24v24H0z" fill="none" />
  </svg>
  `;

  const emptyListText = document.createElement("div");
  emptyListText.classList.add("empty_list_text");

  const emptyTitle = document.createElement("h3");
  const emptyText = document.createElement("p");

  emptyTitle.innerText = "Your Todo list is empty";
  emptyText.innerText = "Let's create your list and execute it.";

  emptyListText.appendChild(emptyTitle);
  emptyListText.appendChild(emptyText);

  if (activeLists.length === 0 && inActiveLists.length === 0) {
    emptyList.appendChild(emptyImg);
    emptyList.appendChild(emptyListText);
    emptyList.style.display = "flex";
  } else {
    emptyList.style.display = "none";
    emptyList.innerHTML = "";
  }
}

function save_render() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_ACTIVE_LISTS, JSON.stringify(activeLists));
  localStorage.setItem(
    LOCAL_STORAGE_INACTIVE_LISTS,
    JSON.stringify(inActiveLists)
  );
}

function deleteAllInActive() {
  inActiveLists = [];
  save_render();
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();

////////////////////////////////////////////////////////////////////////
var text = "update to-do list";
var delay = 100; // cкорость
var elem = document.querySelector(".input_todo");

var print_text = function (text, elem, delay) {
  if (text.length > 0) {
    elem.placeholder += text[0];
    setTimeout(function () {
      print_text(text.slice(1), elem, delay);
    }, delay);
  }
};
print_text(text, elem, delay);

document.getElementById("clearButton").onclick = function (e) {
  document.querySelector(".input_todo").value = "";
};
