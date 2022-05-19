type AsyncMethod<T extends unknown[], R> = (...args: T) => Promise<R>
type ConstructorFirstArg<T> =
  T extends new (...args: infer Arg) => any
  ? Arg extends [infer First, ... infer Rest]
  ? First
  : never
  : never
type FirstArg<T> =
  T extends (...args: infer Arg) => any
  ? Arg extends [infer First, ... infer Rest]
  ? First
  : never
  : never
type SecondArg<T> =
  T extends (...args: infer Arg) => any
  ? Arg extends [infer First, infer Second]
  ? Second
  : never
  : never
type PromiseExecutor = ConstructorFirstArg<PromiseConstructor>
type Resolve = FirstArg<PromiseExecutor>
type Reject = SecondArg<PromiseExecutor>

export function concurrencyLimited<T extends unknown[], R>(asyncMethod: AsyncMethod<T, R>, limit: number): AsyncMethod<T, R> {
  let runningCount = 0;
  const requestBuffer: [Promise<any>, Resolve, Reject, any, T][] = [];

  function next() {
    if (requestBuffer.length > 0) {
      if (runningCount >= limit) {
        return requestBuffer[requestBuffer.length - 1][0];
      }
      runningCount++;
      const [p, resolve, reject, self, args] = requestBuffer.shift()!;
      console.log(requestBuffer.length);
      asyncMethod.apply(self, args).then((result) => {
        runningCount--;
        resolve(result);
        // console.log(result, Date.now());
        next();
      }).catch((err) => {
        runningCount--;
        reject(err);
        // console.log(err, Date.now());
        next();
      });
    }
  }

  return function () {
    // @ts-ignore
    const self = this;
    let resolve: Resolve, reject: Reject;
    const p = new Promise(($resolve, $reject) => {
      resolve = $resolve;
      reject = $reject;
    });
    requestBuffer.push([p, resolve!, reject!, self, Array.from(arguments) as T]);
    next();
    return p as Promise<any>;
  }
}
