var fs = require("fs")
var semver = require("semver")
var package_info = require("../../package.json")
var build_semver_type = process.argv[2]
var new_package_version = semver.inc(package_info.version,build_semver_type)

if(!["major","minor","patch"].includes(build_semver_type))
{
    console.log("Package build suite.");
    console.log("Usage examples:");
    console.log("`npm run build patch` to build patch version");
    console.log("`npm run build minor` to build minor version");
    console.log("`npm run build major` to build major version");
    process.exit(1)
}

console.log("Incrementing package `" + package_info.name + "` version!")
console.log("Old version is " + package_info.version)
console.log("New `" + build_semver_type + "` version will be " + new_package_version)
console.log(new_package_version + " --> " + "./VERSION")
fs.writeFileSync("../../VERSION",new_package_version)
console.log(new_package_version + " --> " + "./package.json")
package_info.version = new_package_version
fs.writeFileSync("../../package.json",JSON.stringify(package_info,null,4))