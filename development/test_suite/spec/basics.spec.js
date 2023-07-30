var json_array_writable_stream = require('main')
var util = require('util')
describe("Basics",function()
{
    it("should allow replacement with option replacement",function()
    {
        var stream = json_array_writable_stream(
        {
            replace_undefined_by: null,
            replacer: function(key, val)
            {
                if(["undefined","object","boolean","number","bigint","string"].indexOf(typeof val) == -1)
                {
                    val = util.inspect(val)
                }
                return val
            }
        })
        var result = ""
        var chunk
        var fn = function TestFunction(){ return "TestString" }
        stream.write(1)
        stream.write(fn)
        stream.write(null)
        stream.write(void(0))
        stream.end()
        while(null !== (chunk = stream.read())) { result+= chunk }
        expect(result).toBe('[1,"[Function: TestFunction]",null,null]')
    })

    it("should allow replacement function processing",function()
    {
        var stream = json_array_writable_stream(
        {
            replacer: function(key, val)
            {
                if(["undefined","object","boolean","number","bigint","string"].indexOf(typeof val) == -1)
                {
                    val = util.inspect(val)
                }
                return val
            }
        })
        var result = ""
        var chunk
        var fn = function TestFunction(){ return "TestString" }
        stream.write(1)
        stream.write(fn)
        stream.write(null)
        stream.end()
        while(null !== (chunk = stream.read())) { result+= chunk }
        expect(result).toBe('[1,"[Function: TestFunction]",null]')
    })

    it("should replace undefined values if option is set",function()
    {
        var stream = json_array_writable_stream({replace_undefined_by:null})
        var result = ""
        var chunk
        var a = { a: "a", u: void(0), b: "b" }
        stream.write(1)
        stream.write(a.nonexistent_property)
        stream.write(a)
        stream.write("test")
        stream.end()
        while(null !== (chunk = stream.read())) { result+= chunk }
        expect(result).toBe('[1,null,{"a":"a","u":null,"b":"b"},"test"]')
    })

    it("should ignore undefined values in objects to produce valid JSON",function()
    {
        var stream = json_array_writable_stream()
        var result = ""
        var chunk
        var a = { a: "a", u: void(0), b: "b" }
        stream.write(1)
        stream.write(a)
        stream.write("test")
        stream.end()
        while(null !== (chunk = stream.read())) { result+= chunk }
        expect(result).toBe('[1,{"a":"a","b":"b"},"test"]')
    })

    it("should ignore undefined values in arrays to produce valid JSON",function()
    {
        var stream = json_array_writable_stream()
        var result = ""
        var chunk
        var a = {}
        stream.write(1)
        stream.write(a.nonexistent_property)
        stream.write("test")
        stream.end()
        while(null !== (chunk = stream.read())) { result+= chunk }
        expect(result).toBe('[1,"test"]')
    })

    it("should ignore undefined values in arrays to produce valid JSON (last array element check)",function()
    {
        var stream = json_array_writable_stream()
        var result = ""
        var chunk
        var a = {}
        stream.write(1)
        stream.write("test")
        stream.write(a.nonexistent_property)
        stream.end()
        while(null !== (chunk = stream.read())) { result+= chunk }
        expect(result).toBe('[1,"test"]')
    })

    it("should ignore undefined values in arrays to produce valid JSON (first array element check)",function()
    {
        var stream = json_array_writable_stream()
        var result = ""
        var chunk
        var a = {}
        stream.write(a.nonexistent_property)
        stream.write(1)
        stream.write("test")
        stream.end()
        while(null !== (chunk = stream.read())) { result+= chunk }
        expect(result).toBe('[1,"test"]')
    })

    it("should process primitive types and null",function()
    {
        var stream = json_array_writable_stream()
        var result = ""
        var chunk
        stream.write(1)
        stream.write("string")
        stream.write(null)
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

    it("should process objects",function()
    {
        var stream = json_array_writable_stream()
        var result = ""
        var chunk
        stream.write(1)
        stream.write("string")
        stream.write(null)
        stream.write({a:"Aa"})
        stream.end()
        while(null !== (chunk = stream.read())) { result+= chunk }
        expect(result).toBe('[1,"string",null,{"a":"Aa"}]')
    })
})