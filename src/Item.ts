import { Prioridade } from "Prioridade";
export interface Item {
	done: boolean,
	text: string,
	prioridade?: Prioridade
}