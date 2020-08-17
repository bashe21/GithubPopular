export default class ArrayUtils {
    /* 
    判断两个数组是否相等， 数组元素相等且数据相同
    */
   static isEqual(arr1, arr2) {
        if ((!arr1 || !arr2)) return false;
        if (arr1.length !== arr2.length) return false;
        for (let i = 0, len = arr1.length; i < len; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    /* 
    clone 数组
    */
   static clone(from) {
    if (!from) return[];
    let newArray = [];
    for (let i = 0, l = from.length; i < l; i++) {
        newArray[i] = from[i];
    }
    return newArray;
}
}