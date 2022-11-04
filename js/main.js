(() => {
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }


  let form = document.createElement("form");
  let input = document.createElement("input");
  let buttonWrapper = document.createElement("div");
  let button = document.createElement("button");



  function createToDoItemForm() {
    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название новой задачи";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить задачу";

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);


    return {
      form,
      input,
      button,
    };
  }

  function createToDoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createToDoItemElement(toDoTtem, {
    onDone,
    onDelete
  }) {
    const doneClass = 'list-group-item-success'  
    const item = document.createElement("li");
    const buttonGroup = document.createElement("div");
    const buttonAdd = document.createElement("btn");
    const buttonDel = document.createElement("btn");

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-item-center"
    );

    if (toDoTtem.done) {
      item.classList.add(doneClass)
    }

    item.textContent = toDoTtem.name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    buttonAdd.classList.add("btn", "btn-success");
    buttonAdd.textContent = "Готово";
    buttonDel.classList.add("btn", "btn-danger");
    buttonDel.textContent = "Удалить";

    buttonAdd.addEventListener("click", () => {
      onDone({toDoTtem, element: item});
      item.classList.toggle(doneClass, toDoTtem.done);
    });

    buttonDel.addEventListener("click", () => {
      onDelete({
        toDoTtem,
        element: item
      })
    });

    buttonGroup.append(buttonAdd);
    buttonGroup.append(buttonDel);
    item.append(buttonGroup);

    return item;
  }

  async function createToDoApp(container, title, owner) {
    const toDoAppTitle = createAppTitle(title);
    const toDoItemForm = createToDoItemForm();
    const toDoList = createToDoList();
    const handlers = {
      onDone({toDoTtem}) {
        toDoTtem.done = !toDoTtem.done;
        fetch(`http://localhost:3000/api/todos/${toDoTtem.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            done: toDoTtem.done
          }),
          headers: {
            'Content-Type': 'application/json',
          }
        });
      },
      onDelete({toDoTtem, element}) {
        if (!confirm('Вы уверены?')) {
          return
        }
        element.remove();
        fetch(`http://localhost:3000/api/todos/${toDoTtem.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });
      },
    }

    container.append(toDoAppTitle);
    container.append(toDoItemForm.form);
    container.append(toDoList);
    const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
    const toDoTtemList = await response.json();

    toDoTtemList.forEach(toDoTtem => {
      const toDoItemElement = createToDoItemElement(toDoTtem, handlers);
      toDoList.append(toDoItemElement);
    });

    toDoItemForm.form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!toDoItemForm.input.value) {
        return;
      }

      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify({
          name: toDoItemForm.input.value.trim(),
          owner,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const toDoTtem = await response.json();

      const toDoItemElements = createToDoItemElement(toDoTtem, handlers);

      toDoList.append(toDoItemElements);
      toDoItemForm.input.value = "";
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    button.disabled = true
  })

  input.addEventListener('input', () => {
    if (input.value !== "") {
      button.disabled = false
    } else if (input.value == "") {
      button.disabled = true
    }
  });

  window.createToDoApp = createToDoApp;
})();