import React from 'react'
import { Link } from 'react-router-dom'
import md5 from 'js-md5'
import { Tabs, Button } from 'antd'
// import user from '../data/user.json'
import { getNickName, Utf8ArrayToStr } from '../utils/utils'
import HandleDB from '../utils/handledb'

const { TabPane } = Tabs

const sqlitePath =
  '/Users/zhengzhipeng/Desktop/Documents/bc409b1c68e01d1c79e869dcd6048452/DB/WCDB_Contact.sqlite'
const sqlitefilePath =
  '/Users/zhengzhipeng/Desktop/Documents/bc409b1c68e01d1c79e869dcd6048452/DB/MM.sqlite'

// 5d36756da6a6f71e68185f13ddd4bb18
// bc409b1c68e01d1c79e869dcd6048452
class Friend extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      myFriends: {},
      myGroup: {},
      myOfficial: {},
    }
  }

  async componentDidMount() {
    // const { match } = this.props
    // const userMD5 = match.params.id
    // console.log(sqlite3)
    const { myFriends, myGroup, myOfficial } = this.state
    this.getChat()
  }

  async getChat() {
    const db = new HandleDB({
      databaseFile: sqlitefilePath,
      readOnly: true,
    })

    await db.connectDataBase()
    let chatData = await db.sql(
      "select * from SQLITE_MASTER where type = 'table' and name like 'Chat/_%' ESCAPE '/' ;",
      'all'
    )

    function getCount(cahtName) {
      let sql = 'select count(*) as count from ' + cahtName
      return db.sql(sql, 'get')
    }
    chatData.forEach(value => {
      getCount(value.name)
        .then(result => {
          return new Promise(resolve => {
            resolve([value.name, result.count])
          })
        })
        .then(result => {
          console.log(result)
        })
    })
  }

  async getFriends() {
    const friendList = {}
    const contactDb = new HandleDB({
      databaseFile: sqlitePath,
      readOnly: true,
    })
    await contactDb.connectDataBase()

    let friendData = await contactDb.sql('select * from Friend', 'all')
    friendData.forEach(value => {
      if (getNickName(Utf8ArrayToStr(value.dbContactRemark)).length > 0) {
        // console.log(value)
        // console.log(getNickName(Utf8ArrayToStr(value.dbContactRemark)))
        // console.log(Utf8ArrayToStr(value.dbContactLocal))
        // let str = Utf8ArrayToStr(value.dbContactSocial)
        // let start = Utf8ArrayToStr(value.dbContactSocial).search(/http/)
        // let end = Utf8ArrayToStr(value.dbContactSocial).search(/\/0R/)
        // let momentsBg = str !== -1 ? str.slice(start, end + 2) : str
        // let isPhoneAdd = str[end + 4] === 'Z'
        // let phone = null

        // if (isPhoneAdd) {
        //   phone = str.slice(str.length - 13, str.length - 2)
        // }
        var nameMd5 = md5(value.userName)
        // friendList[nameMd5] = {
        //   wechatID: value.userName,
        //   nickName: getNickName(Utf8ArrayToStr(value.dbContactRemark)),
        //   momentsBg,
        //   phone,
        // }
        friendList[nameMd5] = {
          wechatID: value.userName,
          nickName: getNickName(Utf8ArrayToStr(value.dbContactRemark)),
        }
      }
    })
    return friendList
  }

  render() {
    return (
      <div>
        <Link to="/">
          <Button>回到首页</Button>
        </Link>
        <Tabs>
          <TabPane tab="朋友" key="1">
            我的朋友
          </TabPane>
          <TabPane tab="群组" key="2">
            我的群组
          </TabPane>
          <TabPane tab="公众号" key="3">
            我的公众号
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Friend
