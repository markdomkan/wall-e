# Wall-e

## Description

Wall-e is a exception gestor for TS/JS apps. The name is inspired by the Pixar Wall-e movie that was based on a robot that managed garbage.

## Installation
```
yarn add @markdomkan/wall_e
```

## Usage

1. Register a custom error that extends from Wall_eError. This class must have message and can have 3 methods beforeAction action and afterAction. These methods all called syncronously with async/await and recibe by parameter serviceBundle object that is optional.


*CustomErrors.ts*

```ts
import { Wall_eError } from "wall_e";

export class CustomError extends Wall_eError {
  message = "Custom message for show at user";

  // optional
  beforeAction = async (serviceBundle: T) => {
    await serviceBundle.showErrorMessageInToast(this.message);
  };

  // optional
  action = async (serviceBundle: T) => {
    await serviceBundle.saveLogOnApi(
      `New error in user ${serviceBundle.getUser()}`
    );
  };

  // optional
  afterAction = async (serviceBundle: T) => {
    console.log("Error");
  };
}
```

2. Register your custom errors and give, if you want, your serviceBundle that help you to handle errors in action hooks.


*main.ts*
```ts
import { registerWalle } from "wall_e";
import { CustomError } from "./CustomErrors";

// can be object, class, array... you will recive in action hooks
const serviceBundle = {
  showErrorMessageInToast: () => {
    //
  },
  saveLogOnApi: () => {
    //
  },
  getUser: () => {
    //
  },
  //
};

// order is important, if more than one function return an error, only first will be executed.
function registerErrors(walle: Wall_e) {
  walle
    .register((error: Error) => {
      if (error.message.contains("something")) {
        return new CustomError();
      }
    })
    //register function returns Wall_e object to chain register calls.
    .register((error: Error) =>
      error.networkError?.status == 401 ? new Unauthenticated() : null
    );
  //
}

const showConsoleErrorWhenCapureError = true;

registerWalle(registerErrors, serviceBundle, showConsoleErrorWhenCapureError);
```

3. Use w_catch fuction to catch your errors.

```ts
import { w_catch } from "wall_e";

try {
    //
} catch (error) {
  w_catch(error);
}
```
