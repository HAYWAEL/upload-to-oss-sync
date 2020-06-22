const fs = require('fs')
const OSS = require('ali-oss')
const chalk = require('chalk')
const path = require('path')
/**
 * 自动上传oss
 * config: oss 配置项 = 》 {
    region,
    accessKeyId,
    accessKeySecret,
    bucket
  }
 * local: 本地地址 需要上传的文件目录位置
 * osspath: 远端oss的上传目录 例如： test / demo 则文件上传到oss的test / demo的目录下面
 * @param {*} {config, local, path}
 */
function uploadToOss({
  config,
  local,
  osspath
}) {
  const client = new OSS(config)
  const webpath = osspath
  const prePath = local
  let log = console.log
  let ckwran = chalk.yellow
  let ckerr = chalk.red
  let success = chalk.green

  let fileCount = 0 // 计算文件个数
  // 核心方法   获取文件并上传
  
  async function getFile(filePath) {
    const files = fs.readdirSync(filePath);
      for(let i=0;i<files.length;i++){
        const filename=files[i]
        const fileFullPath=path.join(filePath, filename)
        const stats = fs.statSync(fileFullPath);
        if(stats.isDirectory()){
          await getFile(fileFullPath) // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
        if(stats.isFile()){
          const opt={
            filePath: fileFullPath,
            filename,
            url: fileFullPath.replace(prePath, '').replace(/\\/g, '/')
          }
          const ret = await put(opt);
          ++fileCount;
          log(success(
            `上传成功 ${fileCount} => ${ret.replace(/^\//, '')}`
          ))
        }
      }
  }
  // 上传文件方法   oss 提供
  async function put(option) {
    try {
      await client.put((`${webpath}` + option.url).replace(/\/+/g, '/'), option.filePath)
      return option.url
    } catch (e) {
      console.error(e)
    }
  }
  getFile(local)
}

module.exports = uploadToOss
