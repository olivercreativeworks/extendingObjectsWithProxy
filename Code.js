// This file is a demo of how we can create a wrapper around another object, while still retaining that object's methods and properties. We use a Proxy to control property access. The JSDocs help with type hints and autocomplete.

/**
 * @template A
 * @typedef {ExtendedArray<A> & {[k in keyof Array<A>]: Array<A>[k] extends function ? ReturnType<Array<A>[k]> extends Array<A> ? 
 * (...args:Parameters<Array<A>[k]>) => ExtendedArray_<A> : ReturnType<Array<A>[k]> : Array<A>[k]}}  ExtendedArray_<A>
 */


/**
 * @template A
 */
class ExtendedArray{
  /** 
   * @private 
   * @param {Array<A>} arr
   */
  constructor(arr){
    /** @private */
    this.arr = arr
  }

  /**
   * @template A
   * @param {Array<A>} arr
   * @return {ExtendedArray_<A>}
   */
  static create(arr){
    return new Proxy(new ExtendedArray(arr), ExtendedArray.handler)
  }


  getValue(){
    return this.arr
  }

  /** @private */
  static get handler(){
    return {
      /** 
       * @param {ExtendedArray} target
       * @param {string} prop
       */
      get(target, prop, receiver){
        if(Reflect.has(target, prop)){
          return Reflect.get(target, prop, receiver)
        }
        if(Reflect.has(target.arr, prop)){
          const value = Reflect.get(target.arr, prop, target.arr)
          if(typeof value !== "function") return value
          return (...args) => {
            const result = value.call(target.arr, ...args)
            return Array.isArray(result) ? new ExtendedArray(result) : result
          }
        }
        return Reflect.get(target, prop, receiver)
      }
    }
  }

  /**
   * Sorts the array from greatest to least and returns the first X values.
   * @param {number} len
   * @return {ExtendedArray_<A>}
   */
  sortClip(len){
    const arr = this.arr.toSorted((a, b) => a - b).slice(0,len)
    return ExtendedArray.create(arr)
  }

}

function myFunctionDemo() {
  const myArr = [1,2,3,4,5,6,7,8,9,0]
  const extendedArr = ExtendedArray.create(myArr)
  console.log(extendedArr.sortClip(3))
  console.log(extendedArr.map(x => x > 5 ? -x : x).sortClip(3))
  console.log(extendedArr[0])
  console.log(extendedArr.length)
  console.log(extendedArr.concat(100, 200, 300, -1).sortClip().getValue())
}
