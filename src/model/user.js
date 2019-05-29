var fs = window.require('fs')
var path = require('path')
var plist = require('plist')

// const documentsPath = '/Users/zhengzhipeng/Desktop/WeChatData/Documents'

function getHeadImg(userInfo) {
  let url = userInfo.filter(element => {
    if (
      typeof element == 'string' &&
      element.indexOf('http://wx.qlogo.cn/') !== -1 &&
      element.slice(-3) == '132'
    ) {
      return element
    }
  })
  return url[0]
}

export function getUserList(documentsPath) {
  const fileList = fs.readdirSync(documentsPath)
  const userList = []
  for (var i = 0; i < fileList.length; i++) {
    if (fileList[i].length == 32 && fileList[i] != '00000000000000000000000000000000') {
      let mmsettingPath = path.join(documentsPath, fileList[i], 'mmsetting.archive')
      var command = 'plutil -convert xml1 ' + mmsettingPath

      window.require('child_process').execSync(command, {
        // child_process会调用sh命令，pc会调用cmd.exe命令
        encoding: 'utf8',
      })
      let content = fs.readFileSync(mmsettingPath, 'utf8')
      let userData = plist.parse(content).$objects
      userList.push({
        nickname: userData[3], // 昵称
        wechatID: userData[2], // 微信号
        headUrl: getHeadImg(userData),
      })
    }
  }
  console.log(userList)
  return userList
}
export default {}
