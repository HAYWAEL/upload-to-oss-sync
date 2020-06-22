
### 将文件上传到oss脚本
****

```js
const uploadToOss = require('@haywael/upload-to-oss-sync')
const path = require('path')

const config = {
  region: 'your_region',
  accessKeyId: 'your_accessKeyId',
  accessKeySecret: 'your_accessKeySecret',
  bucket: 'your_bucket'
}
const osspath = 'demo/1'
const local = path.resolve(__dirname, './dist')
uploadToOss({
  config,
  local,
  osspath
})
```
