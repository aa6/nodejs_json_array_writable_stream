var json_array_writable_stream = require('../index.js')
describe("Basics",function()
{
    it("should process primitive types",function()
    {
        var stream = json_array_writable_stream()
        var result = ""
        var chunk
        stream.write(1)
        stream.write("string")
        stream.write(function(){return null}) // TypeError: May not write null values to stream
        stream.end()
        while(null !== (chunk = stream.read())) { result+= chunk }
        expect(result).toBe('[1,"string",null]')
    })

    it("should process empty streams",function()
    {
        var stream = json_array_writable_stream()
        var result = ""
        var chunk
        stream.end()
        while(null !== (chunk = stream.read())) { result+= chunk }
        expect(result).toBe('[]')
    })
})