export function successRequest(param: any) {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      resolve(param);
    }, 16);
  });
}
export function failRequest(param: any) {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      reject(param);
    }, 16);
  });
}
let i = 0;
export function successOrFailRequest(param: any) {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      if (i++ % 2 === 0) {
        resolve(param);
      } else {
        reject(param);
      }
    }, 16);
  });
}
export const noop = () => { };
