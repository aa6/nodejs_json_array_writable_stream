module.exports = function(input_options, stream_definition)
{
    var options = {}
    var replace_fns = []
    var conveyor_replace_fn
    var workaround_symbol = Symbol()
    var transform_first_call = true
    // Preparing options.
    input_options = (input_options != null) ? input_options : {}
    options.spaces = input_options.spaces
    options.opening = input_options.opening
    options.closing = input_options.closing
    options.replacer = input_options.replacer
    options.separator = input_options.separator
    if(typeof input_options.replace_undefined_with != "undefined") 
        { options.replace_undefined_by = input_options.replace_undefined_with }
    if(typeof input_options.replace_undefined_to != "undefined") 
        { options.replace_undefined_by = input_options.replace_undefined_to }
    if(typeof input_options.replace_undefined_by != "undefined") 
        { options.replace_undefined_by = input_options.replace_undefined_by }
    if(options.opening == null) { options.opening = (options.spaces != null) ? "[\n" : "[" }
    if(options.closing == null) { options.closing = (options.spaces != null) ? "\n]\n" : "]" }
    if(options.separator == null) { options.separator = (options.spaces != null) ? ",\n" : "," }
    if(options.replacer != null)
    {
        if(Array.isArray(options.replacer))
        {
            replace_fns = replace_fns.concat(options.replacer)
        }
        else
        {
            replace_fns.push(options.replacer)
        }
    }
    if(typeof options.replace_undefined_by != "undefined")
    {
        replace_fns.push(function(key, val)
        {
            return (typeof val == "undefined") ? options.replace_undefined_by : val
        })
    }
    if(replace_fns.length > 0)
    {
        conveyor_replace_fn = function(key,val)
        {
            for(var i = 0; i < replace_fns.length; i++)
            {
                val = replace_fns[i](key,val)
            }
            return val
        }
    }
    // Stream definition.
    stream_definition = (stream_definition != null) ? stream_definition : {}
    stream_definition.objectMode = true
    stream_definition.transform = function(chunk, format, done)
    {
        if(typeof chunk === "object" && chunk.hasOwnProperty(workaround_symbol))
        {
            chunk = chunk[workaround_symbol]
        }
        chunk = JSON.stringify(chunk, conveyor_replace_fn, options.spaces)
        if(typeof chunk != "undefined")
        {
            if(transform_first_call)
            { 
                transform_first_call = false
                this.push(options.opening)
            }
            else
            {
                this.push(options.separator)
            }
        }
        done(null, chunk)
    }
    stream_definition.flush = function(done)
    {
        if(transform_first_call) { this.push(options.opening) }
        this.push(options.closing)
        done() // For unknown reason _flush's callback does not support chunks pushing.
    }
    var stream = new require("stream").Transform(stream_definition)
    var stream_original_write_method = stream.write
    stream.write = function()
    {
        var arguments_array = Array.from(arguments)
        if(arguments_array[0] === null) 
        { 
            var contained_input = {}
            contained_input[workaround_symbol] = null
            arguments_array[0] = contained_input
        }
        stream_original_write_method.apply(stream,arguments_array)
    }
    return stream
}