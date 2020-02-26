// Importando estilos
import "./style.css";
import "material-icons/iconfont/material-icons.css";

// Importando classes
import { ToDoList } from "./ToDoList";

// Criando ToDoList a partir do elemento main e seu
// conteúdo

let toDoList = new ToDoList(document.querySelector('main'));
console.log('vai planeta!');