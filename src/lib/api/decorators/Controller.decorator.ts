import {DecoratorsUtils} from "../utils/Decorators.utils";

export interface ControllerDecoratorOptions {
  private?: boolean;
}

export const Controller = (options?: ControllerDecoratorOptions) => {
  return DecoratorsUtils.createClassDecorator((target: object) => {
    DecoratorsUtils.defineMetadata("controller", options, target, "controller");
  });
};
