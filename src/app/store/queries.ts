import { selectActiveEntity, selectActiveId } from "@ngneat/elf-entities";
import { todosStore } from "./store";

export const activeList$ = todosStore.pipe(selectActiveEntity());
export const activeId$ = todosStore.pipe(selectActiveId());