
export function timeout<R, P extends Promise<R>>(
  promise: P,
  ms: number
): Promise<R> {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error('timeout'));
    }, ms);
    promise.then(resolve, reject);
  });
}
