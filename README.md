# nodejs_json_array_writable_stream [![Travis CI badge](https://travis-ci.org/aa6/nodejs_json_array_writable_stream.svg?branch=master) Travis CI](https://travis-ci.org/aa6/nodejs_json_array_writable_stream)
Packing objects into JSON array.
```javascript
var json_array_writable_stream = require("json-array-writable-stream")
var stream = json_array_writable_stream()
stream.write(1)
stream.write("string")
stream.write(function(){return null}) // TypeError: May not write null values to stream
stream.write({a:"Aa"})
stream.end()
stream.pipe(process.stdout) // [1,"string",null,{"a":"Aa"}]
```
Available options:
```javascript
var stream = json_array_writable_stream(
{
    spaces: 0,
    opening: "[",
    closing: "]",
    replacer: function(key, val) { return (key == "key1") ? "Replacement value." : val },
    separator: ",\n",
    replace_undefined_by: null // In case you want these keys to show up in your JSON.
})
```