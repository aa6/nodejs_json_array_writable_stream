var json_array_writable_stream = require('main')
var util = require('util')
describe("Option replace_undefined_to",function()
{
    it("must not be slandered",function()
    {
        var stream = json_array_writable_stream(
        {
            replace_undefined_to: null,
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
        stream.write(null)
        stream.write({slander:void(0)})
        stream.write(void(0))
        stream.end()
        while(null !== (chunk = stream.read())) { result+= chunk }
        expect(result).toBe('[null,{"slander":null},null]')
    })
})