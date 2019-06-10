import React from 'react'
import { Link } from 'react-router-dom'
import md5 from 'js-md5'
import { Tabs, Avatar } from 'antd'
import textEncoding from 'text-encoding'
import '../styles/friend.css'

import { getNickName, getChatterMd5, getHeadImg, getMomentsBg, isPhoneAdd } from '../utils/utils'
import HandleDB from '../utils/handledb'

const { TabPane } = Tabs
const TextDecoder = textEncoding.TextDecoder
const sqlitePath =
  '/Users/zhengzhipeng/Desktop/Documents/5d36756da6a6f71e68185f13ddd4bb18/DB/WCDB_Contact.sqlite'
const sqlitefilePath =
  '/Users/zhengzhipeng/Desktop/Documents/5d36756da6a6f71e68185f13ddd4bb18/DB/MM.sqlite'
var mailList = {}
const [groupList, officialList, friendList] = [{}, {}, {}]
const limitNum = 100
// 5d36756da6a6f71e68185f13ddd4bb18
// bc409b1c68e01d1c79e869dcd6048452
class Friend extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      myFriends: [],
      myGroups: [],
      myOfficials: [],
      myMessages: [],
    }
  }

  async componentDidMount() {
    // const { match } = this.props
    // const userMD5 = match.params.id
    await this.getFriends()
    let PromiseList = await this.getChat()
    Promise.all(PromiseList).then(result => {
      let friends = Object.values(friendList).sort((a, b) => b.count - a.count)
      let groups = Object.values(groupList).sort((a, b) => b.count - a.count)
      let officials = Object.values(officialList).sort((a, b) => b.count - a.count)

      mailList = {}
      this.setState({
        myFriends: friends,
        myGroups: groups,
        myOfficials: officials,
      })
    })
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

    function getCount(chatName) {
      let sql = 'select count(*) as count from ' + chatName
      return db.sql(sql, 'get')
    }

    let PromiseList = []

    chatData.forEach(value => {
      PromiseList.push(
        getCount(value.name).then(result => {
          let chatMd5 = getChatterMd5(value.name)
          // 过滤已迁移的公众号没有对应账号信息，但是有聊天信息
          if (mailList[chatMd5] !== undefined && result.count > limitNum) {
            let { wechatID, nickName, momentsBg, phone, headImg } = mailList[chatMd5]
            let baseInfo = {
              wechatID,
              nickName,
              chatName: value.name,
              chatMd5: chatMd5,
              count: result.count,
              headImg,
            }

            if (wechatID.indexOf('@chatroom') !== -1) {
              groupList[chatMd5] = baseInfo
            } else if (wechatID.indexOf('gh_') !== -1) {
              officialList[chatMd5] = baseInfo
            } else {
              friendList[chatMd5] = Object.assign({}, baseInfo, { momentsBg, phone })
            }
          }
          return result
        })
      )
    })

    return PromiseList
  }

  async getFriends() {
    const contactDb = new HandleDB({
      databaseFile: sqlitePath,
      readOnly: true,
    })
    await contactDb.connectDataBase()

    let friendData = await contactDb.sql('select * from Friend', 'all')
    friendData.forEach(value => {
      let nickName = getNickName(new TextDecoder('utf-8').decode(value.dbContactRemark))
      // getNickName(Utf8ArrayToStr(value.dbContactRemark))
      // 过滤掉没有昵称的账号
      if (nickName.length > 0) {
        let momentsBg = getMomentsBg(value.dbContactSocial)
        let headImg = getHeadImg(value.dbContactHeadImage)
        let phone = isPhoneAdd(value.dbContactSocial)
        // console.log(value.dbContactHeadImage.toString('utf-8'))
        var nameMd5 = md5(value.userName)

        mailList[nameMd5] = {
          wechatID: value.userName,
          nickName: nickName,
          momentsBg,
          phone,
          headImg,
        }
      }
    })
    return mailList
  }

  async getMessage(item) {
    console.log(item)
    const db = new HandleDB({
      databaseFile: sqlitefilePath,
      readOnly: true,
    })
    await db.connectDataBase()
    let sql = 'SELECT * FROM ' + item.chatName + ' order by CreateTime desc limit 100'

    let messageData = await db.sql(sql, 'all')
    this.setState({
      myMessages: messageData.reverse(),
    })
    // eslint-disable-next-line react/destructuring-assignment
    console.log(this.state.myMessages)
  }

  render() {
    const { myFriends, myGroups, myOfficials, myMessages } = this.state
    return (
      <div style={{ paddingBottom: '20px', overflow: 'hidden' }}>
        <div styleName="left-container">
          <Tabs styleName="outer-tabs">
            <TabPane tab="朋友" key="1">
              {myFriends.map(item => (
                <p
                  onClick={() => {
                    this.getMessage(item)
                  }}
                  key={item.chatMd5}
                >
                  <Avatar src={`${item.headImg}/132`}>USER</Avatar>
                  {item.nickName[0]}
                  {item.nickName.length > 1
                    ? `（${item.nickName[item.nickName.length - 1]}）`
                    : null}
                  <span>{item.count}条消息</span>
                </p>
              ))}
            </TabPane>
            <TabPane tab="群组" key="2">
              {myGroups.map(item => (
                <p key={item.chatMd5}>
                  <Avatar src={`${item.headImg}/0`}>USER</Avatar>
                  {item.nickName}
                  <span>{item.count}条消息</span>
                </p>
              ))}
            </TabPane>
            <TabPane tab="公众号" key="3">
              {myOfficials.map(item => (
                <p key={item.chatMd5}>
                  <Avatar src={`${item.headImg}/132`}>USER</Avatar>
                  {item.nickName}
                  <span>{item.count}条消息</span>
                </p>
              ))}
            </TabPane>
          </Tabs>
        </div>
        <div styleName="right-container">
          <p styleName="time">2018.02.03 12:00</p>
          {myMessages.map(item => {
            // 只显示文字消息
            if (item.Type !== 1) {
              return null
            } else {
              return (
                <div
                  key={item.MesLocalID}
                  styleName={item.Des === 0 ? 'message flex-reverse' : 'message'}
                >
                  <Avatar>USER</Avatar>
                  <p>{item.Message}</p>
                </div>
              )
            }
          })}
        </div>
      </div>
    )
  }
}

export default Friend
