module.exports = function(input_options, stream_definition)
{
    var options = {}
    var transform_first_call = true
    // Preparing options.
    input_options = (input_options != null) ? input_options : {}
    options.spaces = input_options.spaces
    options.replacer = input_options.replacer
    options.replace_undefined_by = input_options.replace_undefined_by
    if(input_options.opening == null) { options.opening = (options.spaces != null) ? "[\n" : "[" }
    if(input_options.closing == null) { options.closing = (options.spaces != null) ? "\n]" : "]" }
    if(input_options.separator == null) { options.separator = (options.spaces != null) ? ",\n" : "," }
    if(typeof options.replace_undefined_by != "undefined")
    {
        if(options.replacer != null)
        {
            var original_replacer = options.replacer
            if(Array.isArray(options.replacer))
            {
                original_replacer = (function(replacer_array)
                {
                    return function(key,val)
                    {
                        if(key == "")
                        {
                            var nval = {}
                            for(var i = 0; i < replacer_array.length; i++)
                            {
                                if(replacer_array[i] in val)
                                {
                                    nval[replacer_array[i]] = val[replacer_array[i]]
                                }
                            }
                            return nval
                        }
                        else
                        {
                            return val
                        }
                    }
                })(options.replacer)
            }
            options.replacer = function(key, val)
            {
                val = original_replacer(key,val)
                return (typeof val == 'undefined') ? options.replace_undefined_by : val
            }
        }
        else
        {
            options.replacer = function(key, val)
            {
                return (typeof val == "undefined") ? options.replace_undefined_by : val
            }
        }
    }
    // Stream definition.
    stream_definition = (stream_definition != null) ? stream_definition : {}
    stream_definition.objectMode = true
    stream_definition.transform = function(chunk, format, done)
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
        done(null, JSON.stringify((typeof chunk === "function" ? chunk() : chunk), options.replacer, options.spaces))
    }
    stream_definition.flush = function(done)
    {
        if(transform_first_call) { this.push(options.opening) }
        this.push(options.closing)
        done() // For unknown reason _flush's callback does not support chunks pushing.
    }
    return new require("stream").Transform(stream_definition)
}