import { Item } from "./Item";
import { Prioridade } from "./Prioridade";

const LOCAL_STORAGE_KEY: string = "todolist"

export class ToDoList {

	private form: HTMLFormElement;
	private txtField: HTMLInputElement;
	private btSalvar: HTMLButtonElement;
	private table: HTMLTableElement;
	private list: Item[];

	constructor(el: HTMLElement) {

		// Identificando elementos
		this.form = el.querySelector('form');
		this.txtField = el.querySelector('input[type=text]');
		this.btSalvar = el.querySelector('button[type=submit]');
		this.table = el.querySelector('table');

		// Associando eventos
		this.form.addEventListener("submit", evt => {

			// Previnindo comportamento padrão de envio de formulário
			evt.preventDefault();

			// Verificando se existe um #n no início do texto
			let text = this.txtField.value;
			if (text.match(/^#(1|2|3)\s/)) {
				this.addItem(text.slice(3), Number(text.slice(1, 2)));
			} else {
				this.addItem(text, 1);
			}
			this.txtField.value = "";
			this.render();
		})

		// Inicializando lista
		let storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
		if (storedData) {
			this.list = <Item[]>JSON.parse(storedData);
		} else {
			this.list = []
		}

		// Renderizando lista
		this.render();

		// Pondo o cursor no campo
		this.txtField.focus();

	}

	private render() {
		let tbody = document.createElement('tbody');

		for (const item of this.list) {
			tbody.appendChild(this.rowItem(item))
		}

		this.table.replaceChild(tbody, this.table.firstElementChild)
	}

	private rowItem(item: Item): HTMLTableRowElement {

		// Criando a linha
		let tr = <HTMLTableRowElement>document.createElement('tr');

		// Aplicando classe à linha
		item.done ? tr.className = "done" : tr.className = "";

		// Criando células
		let tdCheck = <HTMLTableCellElement>document.createElement('td');

		// Criando checkbox e adicionando
		let checkbox = <HTMLInputElement>document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.checked = item.done;
		checkbox.addEventListener("click", evt => {
			let isDone = this.toggleItem(item);
			if (isDone) {
				tr.className = "done";
			} else {
				tr.className = "";
			}
		})
		tdCheck.appendChild(checkbox);

		let tdText = <HTMLTableCellElement>document.createElement('td');
		// Adicionando texto
		tdText.textContent = item.text;

		// Criando botão de remoção
		let btRemover = document.createElement('i');
		btRemover.className = "material-icons";
		btRemover.innerHTML = "delete";
		btRemover.addEventListener("click", evt => {
			if (window.confirm("Tem certeza que deseja remover item da lista?")) {
				this.removeItem(item);
			}
		})

		// Criando celula de actions
		let tdActions = <HTMLTableCellElement>document.createElement('td');
		tdActions.appendChild(btRemover);

		// Criando célula de prioridade
		let tdPrioridade = <HTMLTableCellElement>document.createElement('td');
		tdPrioridade.innerHTML = `[${Prioridade[item.prioridade]}]`;

		// Adicionando celulas à linha
		tr.appendChild(tdCheck);
		tr.appendChild(tdText);
		tr.appendChild(tdPrioridade);
		tr.appendChild(tdActions);

		//retornando linha
		return tr;
	}

	private toggleItem(item: Item): boolean {
		item.done = !item.done;
		this.saveList();
		return item.done;
	}

	private addItem(texto: string, prioridade?: Prioridade): Item {
		let item: Item;
		if (prioridade) {
			item = {
				done: false,
				text: texto,
				prioridade
			}
		} else {
			item = {
				done: false,
				text: texto
			}
		}
		this.list.push(item);

		this.saveList();
		return item;
	}

	private removeItem(item: Item): void {
		let pos = this.list.indexOf(item);
		this.list.splice(pos, 1);
		this.render();
		this.saveList();
	}

	private saveList() {
		window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.list))
	}

}