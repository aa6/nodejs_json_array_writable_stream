var fs = require("fs")
var package_info = require("../../package.json")
var node_child_process = require("child_process")

node_child_process.execSync("cd ../.. && npm pack",{stdio:"inherit"})
var source_file = package_info.name + "-" + package_info.version + ".tgz"
var destination_dir = "builds/"
var destination_file = "builds/" + package_info.name + "-" + package_info.version + ".tgz"

console.log(source_file + " --> " + destination_file)

process.chdir("../..")
try { fs.mkdirSync(destination_dir) } catch(err) { }
fs.renameSync(source_file,destination_file)