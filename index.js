module.exports = function(json_options, stream_definition)
{
    var transform_first_call = true
    // JSON options: spaces, replacer, opening, closing, separator.
    json_options = (json_options != null) ? json_options : {}
    if(json_options.opening == null) { json_options.opening = (json_options.spaces != null) ? "[\n" : "[" }
    if(json_options.closing == null) { json_options.closing = (json_options.spaces != null) ? "\n]" : "]" }
    if(json_options.separator == null) { json_options.separator = (json_options.spaces != null) ? ",\n" : "," }
    // Stream definition.
    stream_definition = (stream_definition != null) ? stream_definition : {}
    stream_definition.objectMode = true
    stream_definition.transform = function(chunk, format, done)
    {
        if(transform_first_call)
        { 
            transform_first_call = false
            this.push(json_options.opening)
        }
        else
        {
            this.push(json_options.separator)
        }
        done(null, JSON.stringify((typeof chunk === "function" ? chunk() : chunk), json_options.replacer, json_options.spaces))
    }
    stream_definition.flush = function(done)
    {
        if(transform_first_call) { this.push(json_options.opening) }
        this.push(json_options.closing)
        done() // For unknown reason _flush's callback does not support chunks pushing.
    }
    return new require("stream").Transform(stream_definition)
}