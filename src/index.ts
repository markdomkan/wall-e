import { Wall_e, ErrorTrigger } from "./classes/Wall_e";
import { Wall_eError } from "./classes/wall_eError";

let walle: Wall_e<any> | undefined;

function registerWalle<T>(
  register: (walle: Wall_e<T>) => Wall_e<T>,
  serviceBundle?: any,
  showErrorOnConsole = false
): void {
  const w = new Wall_e<T>(serviceBundle, showErrorOnConsole);
  walle = register(w);
}

function w_catch(error: any) {
  if (walle === undefined) {
    console.error("Wall-e is not initialized!");
  } else {
    walle.handle(error);
  }
}

function getWalle(): Wall_e<any> | undefined {
  return walle;
}

export { Wall_e, ErrorTrigger, Wall_eError, registerWalle, w_catch, getWalle };
