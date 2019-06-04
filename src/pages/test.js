let WCDB_Contact_Friend = {
  certificationFlag: 0, // 0 用户，群组(漂流瓶、朋友推荐消息也包含在内) 8 服务号(个人)？ 24 公众号 56 微信团队
  dbContactBrand: null,
  dbContactChatRoom: null,
  dbContactHeadImage: Uint8Array(), // 头像 Vhttp://xxx/132 V、w开头服务号，其余还有}、Y、~、T、X、z等开头，132结尾是略缩图，0结尾是大图
  dbContactLocal: Uint8Array(), // 乱码，地址信息？？？
  dbContactOpenIM: null,
  dbContactOther: Uint8Array(), // lv2_a9732..格式暂时不清楚
  dbContactProfile: Uint8Array(), // 个人签名
  dbContactRemark: Uint8Array(), // 用户昵称以及备注
  dbContactSocial: Uint8Array(), // 朋友圈背景、后缀'Z'表示查看手机号(通过手机搜索添加)、店铺信息，？？
  encodeUserName: 'v1_c6a215ca7c...@stranger', // 身份标识？？
  extFlag: 0,
  imgStatus: 2,
  openIMAppid: null,
  type: 1, // 状态，暂不知道对应规则
  userName: 'wxid_3je9brbhp72222', // 用户名个人以wxid_开头，群组后面有@chatroom标识，公众号、服务号以gh_开头
  _packed_DBContactTable: null,
}
