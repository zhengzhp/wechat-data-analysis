/* eslint-disable react/sort-comp */
import React from 'react'
import md5 from 'js-md5'
import { Tabs, Avatar, Spin } from 'antd'
import textEncoding from 'text-encoding'
import moment from 'moment'

import { parseString } from 'xml2js'
import {
  getNickName,
  getChatterMd5,
  getHeadImg,
  getMomentsBg,
  isPhoneAdd,
  throttle,
} from '../utils/utils'
import HandleDB from '../utils/handledb'
import '../styles/friend.css'

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
      chatName: '',
      nowScrollTop: 0,
      isLoad: false,
      pageIndex: 0,
      pageSize: 100,
    }
  }

  async componentDidMount() {
    // const { match } = this.props
    // const userMD5 = match.params.id
    await this.getFriends()
    let PromiseList = await this.getChat()
    Promise.all(PromiseList).then(result => {
      // 按照消息条数排序
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

  // 查询聊天信息
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

  // 获取聊天对象
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

  scrollThrottle = throttle(() => {
    let ele = document.getElementById('msg-box')
    let { pageIndex, pageSize, myMessages } = this.state

    // 查询出来所有数据后禁止加载更多
    if (myMessages.length % pageSize !== 0) {
      this.setState({
        isLoad: false,
      })
      return
    }
    let scrollTop = ele.scrollTop
    if (scrollTop < 100) {
      setTimeout(() => {
        this.setState(
          {
            pageIndex: pageIndex + 1,
          },
          this.getMessage
        )
      }, 100)
    }
  }, 500)

  selectChat(chatName) {
    // 禁止切换时触发load动作
    var ele = document.getElementById('msg-box')
    ele.removeEventListener('scroll', this.scrollThrottle, false)
    this.setState(
      {
        myMessages: [],
        pageIndex: 0,
        chatName,
      },
      this.getMessage
    )
  }

  // 获取聊天记录
  async getMessage() {
    const { pageSize, pageIndex, chatName, myMessages } = this.state
    const db = new HandleDB({
      databaseFile: sqlitefilePath,
      readOnly: true,
    })
    await db.connectDataBase()
    let sql = `SELECT * FROM ${chatName} order by CreateTime desc limit ${pageSize} offset ${pageIndex *
      pageSize}`

    let data = await db.sql(sql, 'all')

    let messageData = data.reverse()
    messageData = messageData.map((item, index) => {
      // 语音消息
      if (item.Type === 50) {
        parseString(
          `<root>
            ${item.Message}
          </root>`,
          (_, result) => {
            let seconds = result.root.voiplocalinfo && result.root.voiplocalinfo[0].duration[0]
            let wordingtype =
              result.root.voiplocalinfo && result.root.voiplocalinfo[0].wordingtype[0]
            item.MsgContent = {
              duration: `${Math.floor(seconds / 60)}:${seconds % 60}`,
              type: wordingtype,
            }
          }
        )
      }
      if (
        index < messageData.length - 1 &&
        messageData[index + 1].CreateTime - item.CreateTime > 60 * 5
      ) {
        item.MsgDate = moment(messageData[index + 1].CreateTime * 1000).format('YYYY-MM-DD HH:mm')
      }
      return item
    })
    var ele = document.getElementById('msg-box')
    this.setState(
      {
        myMessages: messageData.concat(myMessages),
        isLoad: true,
        nowScrollTop: ele.scrollHeight + 25,
      },
      () => {
        const { nowScrollTop } = this.state
        if (pageIndex === 0) {
          ele.scrollTop = ele.scrollHeight
        } else {
          ele.scrollTop = ele.scrollHeight - nowScrollTop
        }

        ele.removeEventListener('scroll', this.scrollThrottle, false)
        ele.addEventListener('scroll', this.scrollThrottle, false)
      }
    )
    // eslint-disable-next-line react/destructuring-assignment
    console.log(this.state.myMessages)
  }

  render() {
    const { myFriends, myGroups, myOfficials, myMessages, isLoad } = this.state
    return (
      <div style={{ paddingBottom: '20px', overflow: 'hidden' }}>
        <div styleName="left-container">
          <Tabs styleName="outer-tabs">
            <TabPane tab="朋友" key="1">
              {myFriends.map(item => (
                <p
                  onClick={() => {
                    this.selectChat(item.chatName)
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
                <p
                  onClick={() => {
                    this.selectChat(item.chatName)
                  }}
                  key={item.chatMd5}
                >
                  <Avatar src={`${item.headImg}/0`}>USER</Avatar>
                  {item.nickName}
                  <span>{item.count}条消息</span>
                </p>
              ))}
            </TabPane>
            <TabPane tab="公众号" key="3">
              {myOfficials.map(item => (
                <p
                  onClick={() => {
                    this.selectChat(item.chatName)
                  }}
                  key={item.chatMd5}
                >
                  <Avatar src={`${item.headImg}/132`}>USER</Avatar>
                  {item.nickName}
                  <span>{item.count}条消息</span>
                </p>
              ))}
            </TabPane>
          </Tabs>
        </div>
        <div id="msg-box" styleName="right-container">
          {isLoad ? <Spin /> : null}
          {myMessages.length > 0 ? (
            myMessages.map(item => {
              // 只显示文字消息
              if (item.Type !== 1) {
                if (item.Type === 50) {
                  return (
                    <div key={item.MesLocalID}>
                      <div styleName={item.Des === 0 ? 'message flex-reverse' : 'message'}>
                        <Avatar>USER</Avatar>
                        <p>语音通话时长 {item.MsgContent.duration}</p>
                      </div>
                      <p styleName="time">{item.MsgDate}</p>
                    </div>
                  )
                } else {
                  return (
                    <div key={item.MesLocalID}>
                      <div styleName={item.Des === 0 ? 'message flex-reverse' : 'message'}>
                        <Avatar>USER</Avatar>
                        <p style={{ backgroundColor: 'burlywood' }}>其他类型消息</p>
                      </div>
                      <p styleName="time">{item.MsgDate}</p>
                    </div>
                  )
                }
              } else {
                if (item.MsgDate) {
                  return (
                    <div key={item.MesLocalID}>
                      <div styleName={item.Des === 0 ? 'message flex-reverse' : 'message'}>
                        <Avatar>USER</Avatar>
                        <p>{item.Message}</p>
                      </div>
                      <p styleName="time">{item.MsgDate}</p>
                    </div>
                  )
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
              }
            })
          ) : (
            <p styleName="empty">暂无消息</p>
          )}
        </div>
      </div>
    )
  }
}

export default Friend
