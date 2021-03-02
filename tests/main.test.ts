import { getWalle, registerWalle, Wall_e, w_catch } from "../src/index";
import TestError, { sleep } from "./testHelper";

describe("Core", () => {
  it("it can register error", () => {
    const walle = new Wall_e();
    const errorTrigger = (error: Error) => {
      if (error.message == "trigger") {
        return new TestError();
      }
    };
    walle.register(errorTrigger);
    expect(walle.getRegisteredErrors()[0]).toBe(errorTrigger);
  });

  it("Can handle error", () => {
    const walle = new Wall_e();
    const errorTrigger = jest.fn();
    walle.register(errorTrigger);
    walle.handle(new Error());
    expect(errorTrigger).toHaveBeenCalledTimes(1);
  });
});

describe("Calling functions", () => {
  it("Call beforeAction function", () => {
    const walle = new Wall_e();
    const testError = new TestError();
    testError.beforeAction = jest.fn();
    const errorTrigger = () => testError;
    walle.register(errorTrigger);
    walle.handle(new Error());
    expect(testError.beforeAction).toHaveBeenCalled();
  });

  it("Call action function", () => {
    const walle = new Wall_e();
    const testError = new TestError();
    testError.action = jest.fn();
    const errorTrigger = () => testError;
    walle.register(errorTrigger);
    walle.handle(new Error());
    expect(testError.action).toHaveBeenCalled();
  });

  it("Call afterAction function", () => {
    const walle = new Wall_e();
    const testError = new TestError();
    testError.afterAction = jest.fn();
    const errorTrigger = () => testError;
    walle.register(errorTrigger);
    walle.handle(new Error());
    expect(testError.afterAction).toHaveBeenCalled();
  });

  it("Action hooks are asyncron and are called in serie", async () => {
    const walle = new Wall_e();
    const testError = new TestError();
    testError.beforeAction = jest.fn(async () => {
      sleep(300);
    });
    testError.action = jest.fn(async () => {
      sleep(200);
    });
    testError.afterAction = jest.fn(async () => {
      sleep(100);
    });
    walle.register(() => testError);
    walle.handle(new Error());

    await Promise.all([
      (testError.beforeAction as jest.Mock).mock.results[0],
      (testError.action as jest.Mock).mock.results[0],
      (testError.afterAction as jest.Mock).mock.results[0],
    ]);

    expect(testError.beforeAction).toHaveBeenCalledBefore(
      testError.action as jest.Mock
    );
    expect(testError.action).toHaveBeenCalledBefore(
      testError.afterAction as jest.Mock
    );
  });
});

describe("Module static part", () => {
  it("Wall-e is not initalized", () => {
    console.error = jest.fn();
    w_catch(new Error());
    expect(console.error).toHaveBeenCalled();
  });

  it("Wall-e is registered", () => {
    const testError = new TestError();
    registerWalle((walle) => walle.register(() => testError));
    expect(getWalle()).toBeInstanceOf(Wall_e);
  });

  it("Wall-e catch errors", () => {
    const testError = new TestError();
    testError.action = jest.fn();
    registerWalle((walle) => walle.register(() => testError));
    w_catch(new Error());
    expect(testError.action).toHaveBeenCalled();
  });
});

describe("Filtering Errors", () => {
  it("Wall-e throw TestError", () => {
    const testError = new TestError();
    testError.action = jest.fn();
    registerWalle((walle) =>
      walle.register((error: Error) => {
        if (error.message == "trigger") {
          return testError;
        }
      })
    );

    w_catch(new Error("trigger"));
    expect(testError.action).toHaveBeenCalled();
  });

  it("Wall-e not throw TestError", () => {
    const testError = new TestError();
    testError.action = jest.fn();
    registerWalle((walle) =>
      walle.register((error: Error) => {
        if (error.message == "trigger") {
          return testError;
        }
      })
    );

    w_catch(new Error());
    expect(testError.action).not.toHaveBeenCalled();
  });

  it("Wall-e throw a TestError without generate", () => {
    const errorTrigger = jest.fn();
    registerWalle((walle) => walle.register(errorTrigger));
    w_catch(new TestError());
    expect(errorTrigger).not.toHaveBeenCalled();
  });

  it("wall-e call console error", () => {
    console.error = jest.fn();
    const walle = new Wall_e(null, true);
    walle.handle(new Error());
    expect(console.error).toHaveBeenCalled();
  });
});
