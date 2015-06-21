///<reference path="es6-promise/es6-promise"/>
interface Window {
  fetch:(url: string, options?: {}) => Promise<any>
}