import { Wall_eError } from "./classes/wall_eError";

export class ServerError extends Wall_eError {
  message =
    "Pareix que ara mateix hi ha alguns problemes als nostres servidors, si us plau, torna a provar-ho en una estona.";
}

export class ConnectionError extends Wall_eError {
  message =
    "Estem tenint dificultats per connectar-nos als nostres servidors, si us plau, revisa la teva connexió.";
}

export class DefaultError extends Wall_eError {
  message =
    "Si us plau, torna-ho a provar. Si continua sortint aquest error, posa't en contacte amb nosaltres.";
}
