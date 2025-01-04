import {AsyncLocalStorage} from "node:async_hooks";

interface RequestContext {
  userId: null | number;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export const RequestContextManager = {
  get() {
    return asyncLocalStorage.getStore();
  },
  run<T>(context: RequestContext, callback: () => T) {
    return asyncLocalStorage.run(context, callback);
  },
};
