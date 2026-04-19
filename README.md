# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

* [Overview](#overview)

  * [The challenge](#the-challenge)
  * [Screenshot](#screenshot)
  * [Links](#links)
* [My process](#my-process)

  * [Built with](#built-with)
  * [What I learned](#what-i-learned)
  * [Useful resources](#useful-resources)
  * [AI Collaboration](#ai-collaboration)
* [Author](#author)
* [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

* View the optimal layout for the app depending on their device's screen size
* See hover states for all interactive elements on the page
* Add new todos to the list
* Mark todos as complete
* Delete todos from the list
* Filter by all/active/complete todos
* Clear all completed todos
* Toggle light and dark mode
* **Bonus**: Drag and drop to reorder items on the list

### Screenshot

![Desktop Screenshot light](./screenshots/todo%20light%20desktop.png)
![Desktop Screenshot dark](./screenshots/todo%20dark%20desktop.png)
![Mobile Screenshot light](./screenshots/todo%20light%20mobile.png)
![Mobile Screenshot dark](./screenshots/todo%20dark%20mobile.png)


### Links

* Solution URL: To be added after Frontend Mentor submission
* Live Site URL: Coming soon

---

## My process

### Built with

* HTML5 semantic markup
* CSS custom properties (variables)
* Flexbox for layout
* Media queries for responsive design
* Vanilla JavaScript for dynamic behavior
* Local Storage API for persistence
* Drag and Drop API for reordering todos
* Animations for smooth interactions

### What I learned

This project helped me practice:

* **State management:** Keeping todos, filter state, and theme in a single state object for efficient updates.

```js
const state = {
    todos: JSON.parse(localStorage.getItem('todos')) || [],
    filter: 'all',
    isDarkMode: localStorage.getItem('darkMode') === 'true'
};
```

* **Efficient DOM updates:** Updating only the affected todo item instead of re-rendering the full list.

```js
const element = elements.todoList.querySelector(`[data-id="${id}"]`);
element.classList.toggle('completed', todo.completed);
```

* **Drag and drop:** Implemented reordering of todos without full re-render.

```js
const [removed] = state.todos.splice(draggedIndex, 1);
state.todos.splice(targetIndex, 0, removed);
```

* **Theme switching:** Using CSS variables and a `data-theme` attribute to easily toggle dark/light mode.

```js
document.documentElement.setAttribute('data-theme', 'dark');
```

* **Persistence with localStorage:** Todos and theme preferences are saved across page refreshes.

```js
localStorage.setItem('todos', JSON.stringify(state.todos));
localStorage.setItem('darkMode', state.isDarkMode);
```

* **Filtering:** Applied visibility classes to items based on the selected filter without re-rendering.

* **Animations:** Smooth slide-in for new todos and fade-out for deletions.


### Useful resources

* [MDN Web Docs - Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) – Helped me implement drag-and-drop for todos
* [CSS Tricks - CSS Variables](https://css-tricks.com/a-complete-guide-to-custom-properties/) – Helped me set up light/dark themes efficiently
* [Frontend Mentor Community](https://www.frontendmentor.io/community) – Great source of tips and inspiration

### AI Collaboration

I used ChatGPT as a coding assistant to:

* Brainstorm optimized DOM update logic
* Troubleshoot drag-and-drop issues
* Refactor code for clarity and efficiency

It helped speed up debugging
---

## Author

* Frontend Mentor - [@Chisom07](https://www.frontendmentor.io/profile/Chisom07)
* GitHub - [Chisom](https://github.com/Chisom07)

---

## Acknowledgments

Thanks to Frontend Mentor for providing this challenge. It was an excellent exercise in building a fully interactive frontend application, including theme management, drag-and-drop reordering, and efficient DOM manipulation.
