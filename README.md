# Extending objects with Proxy

This script illustrates how we can use Proxy to extend object properties and methods.

## Description
Instead of adding methods to an object's prototype, we can create a wrapper around it.

The wrapper can retain a private reference to the object, and implement methods or properties that may not already be on the object.

Then, using the proxy, we can ensure that we have access to the wrapper's methods and properties as well as the object's own methods and properties. 

## License
[MIT License](./LICENSE.md)
