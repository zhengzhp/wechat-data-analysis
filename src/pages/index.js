import React from 'react'
import { Button, Card, message, Icon, Input, Avatar } from 'antd'
import styles from '../styles/index.css'
import { getUserList } from '../model/user'

const { dialog } = window.require('electron').remote

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filePath: '/Users/zhengzhipeng/Desktop/WeChatData/Documents',
      userList: [],
    }
    this.openDialog = this.openDialog.bind(this)
    this.selectUser = this.selectUser.bind(this)
  }

  componentDidMount() {
    const { filePath } = this.state
    let userlist = getUserList(filePath)
    if (userlist.length === 0) {
      return message.error('当前文件夹下没有可用数据', 2)
    }
    this.setState({
      userList: userlist,
    })
  }
  selectUser(info) {
    const { history } = this.props
    const { MD5 } = info
    history.push({
      pathname: `friend/${MD5}`,
    })
  }

  openDialog() {
    let filePath = dialog.showOpenDialog({ properties: ['openDirectory'] })

    if (filePath) {
      this.setState({
        filePath: filePath[0],
      })
      let userlist = getUserList(filePath[0])
      if (userlist.length === 0) {
        return message.error('当前文件夹下没有可用数据', 2)
      }
      this.setState({
        userList: userlist,
      })
    }
  }

  render() {
    const { filePath, userList } = this.state
    return (
      <div styleName="outer-container">
        <Button onClick={this.openDialog}>
          <Icon type="plus" />
          选择数据文件夹
        </Button>
        <Input
          disabled
          placeholder={filePath ? `当前选择：${filePath}` : '/Users/xxxx/WeChatData/Documents'}
        />
        {userList.length > 0 ? (
          <Card className={styles['card-list']}>
            <p>选择需要解析的用户数据</p>
            {userList.map(item => (
              <div onClick={() => this.selectUser(item)} className="nowrap" key={item.wechatID}>
                <Avatar src={item.headUrl}>USER</Avatar>
                <span>用户名：{item.nickname}</span>
                <span>ID：{item.wechatID}</span>
              </div>
            ))}
          </Card>
        ) : null}
      </div>
    )
  }
}

export default App
