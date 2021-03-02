import { Wall_eError } from "../src/index";

export default class TestError extends Wall_eError {
  message = "Test Error message";
}
export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
