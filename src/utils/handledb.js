var SQLite3 = require('sqlite3').verbose()

class HandleDB {
  constructor(options) {
    this.databaseFile = options && options.databaseFile // 数据库文件(文件路径+文件名)
    this.readOnly = options && options.readOnly

    this.db = null // 打开的数据库对象
  }

  connectDataBase() {
    let _self = this
    if (_self.databaseFile) {
      new Error('请输入数据库地址')
    }
    return new Promise((resolve, reject) => {
      _self.db = new SQLite3.Database(
        _self.databaseFile,
        _self.readOnly ? SQLite3.OPEN_READONLY : null,
        function(err) {
          if (err) reject(new Error(err))
          resolve('数据库连接成功')
        }
      )
    })
  }

  createTable(sentence) {
    let _self = this
    return new Promise((resolve, reject) => {
      _self.db.exec(sentence, function(err) {
        if (err) reject(new Error(err))
        resolve('表创建成功 / 已存在,不需要重新创建该表')
      })
    })
  }

  sql(sql, mode, param) {
    let _self = this
    mode = mode == 'all' ? 'all' : mode == 'get' ? 'get' : 'run'
    return new Promise((resolve, reject) => {
      function cb(err, data) {
        if (err) {
          reject(new Error(err))
        } else {
          if (data) {
            resolve(data) // 返回数据查询成功的结果
          } else {
            resolve('success') // 提示 增 删 改 操作成功
          }
        }
      }
      param ? _self.db[mode](sql, param, cb) : _self.db[mode](sql, cb)
    })
  }
}

// // 使用
// let db = new HandleDB({
//   databaseFile: './data/test.db',
//   tableName: 'test',
// })

// // 查询
// db.sql(`select * from ${tableName} where same_day = ?`, '2017-7-12', 'all')
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => {
//     console.log(err)
//   })
// 参考地址
// https://www.cnblogs.com/sorrowx/p/7162356.html?utm_source=itdadao&utm_medium=referral
export default HandleDB
