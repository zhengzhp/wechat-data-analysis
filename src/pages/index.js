import React from 'react'
import { Button, Card, message, Icon, Input } from 'antd'
// import styles from '../styles/index.css'
import { getUserList } from '../model/user'
import '../styles/index.css'

const { dialog } = window.require('electron').remote

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filePath: null,
    }
    this.openDialog = this.openDialog.bind(this)
  }

  componentDidMount() {
    // console.log(getUserList)
    // console.log(styles)
    // console.log(
    //   dialog
    // )
    // userList()
  }

  openDialog() {
    let filePath = dialog.showOpenDialog({ properties: ['openDirectory'] })

    if (filePath) {
      this.setState({
        filePath: filePath[0],
      })
      let userlist = getUserList(filePath[0])
      if (userlist.length === 0) {
        message.error('当前文件夹下没有可用数据', 2)
      }
    }
  }

  render() {
    const { filePath } = this.state
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
        <Card style={{ width: 300 }}>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>
    )
  }
}

export default App
