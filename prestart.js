const package = require('./package.json');
if(package.engines != null && package.engines.node != null
&& !require('semver').satisfies(process.version,package.engines.node))
{
    throw new Error(
        'REQUIRED NODE.JS VERSION ' + package.engines.node + ' ' +
        'NOT SATISFIED WITH CURRENT VERSION ' + process.version
    );
    process.exit(1); 
}