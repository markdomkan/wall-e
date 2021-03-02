import { DefaultError } from "../defaultErrors";
import { Wall_eError } from "./wall_eError";

export type ErrorTrigger = (error: any) => Wall_eError | void;

export class Wall_e<T> {
  private errors: ErrorTrigger[] = [];

  constructor(private serviceBundle?: T, private showErrorOnConsole = false) {}

  public register(errorTrigger: ErrorTrigger): this {
    this.errors.push(errorTrigger);
    return this;
  }

  public getRegisteredErrors(): ErrorTrigger[] {
    return this.errors;
  }

  public async handle(error: any): Promise<void> {
    if (this.showErrorOnConsole) {
      console.error(error);
    }

    let walleError: Wall_eError;

    if (!(error instanceof Wall_eError)) {
      walleError = this.getError(error);
    } else {
      walleError = error;
    }

    if (walleError.beforeAction) {
      await walleError.beforeAction(this.serviceBundle);
    }

    if (walleError.action) {
      await walleError.action(this.serviceBundle);
    }

    if (walleError.afterAction) {
      await walleError.afterAction(this.serviceBundle);
    }
  }

  private getError(error: any): Wall_eError {
    let userError = null;

    for (const trigger of this.errors) {
      userError = trigger(error);
      if (userError) {
        break;
      }
    }

    if (!userError) {
      return new DefaultError();
    }
    return userError;
  }
}
