/* eslint-disable @typescript-eslint/no-explicit-any */
export default function getObjectDiff(obj1: Record<string, any>, obj2: Record<string, any>): Record<string, any> {
  function isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  const diff: Record<string, any> = {};

  for (const key in obj1) {
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      const nestedDiff = getObjectDiff(obj1[key], obj2[key]);
      if (Object.keys(nestedDiff).length > 0) {
        diff[key] = nestedDiff;
      }
    } else if (obj1[key] !== obj2[key]) {
      diff[key] = obj2[key];
    }
  }

  for (const key in obj2) {
    if (!obj1.hasOwnProperty(key)) {
      diff[key] = obj2[key];
    }
  }

  return diff;
}
