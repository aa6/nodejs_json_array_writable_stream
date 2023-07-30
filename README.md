# nodejs_json_array_writable_stream [![Travis CI badge](https://travis-ci.org/aa6/nodejs_json_array_writable_stream.svg?branch=master) Travis CI](https://travis-ci.org/aa6/nodejs_json_array_writable_stream)
Packing objects into JSON array.
```javascript
var json_array_writable_stream = require("json-array-writable-stream")
var stream = json_array_writable_stream()
stream.write(1)
stream.write("string")
stream.write(null)
stream.write({a:"Aa"})
stream.write(void(0)) // Will ignore undefined by default
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