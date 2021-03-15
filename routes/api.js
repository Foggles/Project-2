const db = require('./../models')
const nodemailer = require('nodemailer')
const configs = require('./../config/config.json')

function addItem (req, res, title, email, type) {
  // console.log('new code add item', req, res, title, email, type)
  db.todolist.create({
    title: title,
    email: email,
    checked: 'false',
    type: type
  }).then((error, result) => {
    // console.log('cc', result);
    if (!result) {
      console.log('add new error')

      //  console.log(error)
      return res.send(
        JSON.stringify({
          success: false,
          msg: 'we can\'t add item, right now, come later'
        })
      )
    } else {
      console.log('new res', result)
      return res.send(JSON.stringify({
        success: true,
        msg: 'Done, Add the item'
      }))
    }
  })
}

function checkState (req, res, id, state, email) {
  db.todolist.findAll({
    where: {
      email: email,
      id: id
    }
  }).then(async (results) => {
    if (!results) {
      return res.send(
        JSON.stringify({
          success: false,
          msg: 'we can\'t add item, right now, come later'
        })
      )
    } else {
      db.todolist.update({
        checked: state
      }, {
        where: {
          email: email,
          id: id
        }
      }).then((v) => {
        return res.send(
          JSON.stringify({
            success: true,
            msg: 'updated the item'
          })
        )
      })
    }
  })
}

function getAllMyRequest (req, res, email, UserType) {
  if (UserType == 'customer') {
    db.reqs.findAll({
      where: {
        to: email
      }
    }).then(async (results) => {
      if (!results) {
        return res.send(
          JSON.stringify({
            success: false,
            msg: 'we can\'t add item, right now, come later'
          })
        )
      } else {
        // passing token into cookies
        return res.send(
          JSON.stringify(results)
        )
      }
    })
  } else {
    db.reqs.findAll({
      where: {
        from: email
      }
    }).then(async (results) => {
      if (!results) {
        return res.send(
          JSON.stringify({
            success: false,
            msg: 'we can\'t add item, right now, come later'
          })
        )
      } else {
        // passing token into cookies
        return res.send(
          JSON.stringify(results)
        )
      }
    })
  }
}

function getItems (req, res, email) {
  console.log('get items', email)
  if (email) {
    db.todolist.findAll({
      where: {
        email: email
      }
    }).then(async (results) => {
      if (!results) {
        return res.send(
          JSON.stringify({
            success: false,
            msg: 'we can\'t add item, right now, come later'
          })
        )
      } else {
        // passing token into cookies
        return res.send(
          JSON.stringify(results)
        )
      }
    })
  } else {
    db.todolist.findAll({
      where: {
        checked: 'true'
      }
    }).then(async (results) => {
      if (!results) {
        return res.send(
          JSON.stringify({
            success: false,
            msg: 'we can\'t add item, right now, come later'
          })
        )
      } else {
        // passing token into cookies
        return res.send(
          JSON.stringify(results)
        )
      }
    })
  }
}

async function sendEmailTo (to, from, title, text) {
  const mailUser = configs.development.mailUser
  const mailPass = configs.development.mailPass
  const mailHost = configs.development.mailHost
  // async..await is not allowed in global scope, must use a wrapper
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount
  if (mailUser === '') {
    testAccount = await nodemailer.createTestAccount()
  }

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: mailHost === '' ? 'smtp.ethereal.email' : mailHost,
    port: 465,
    secure: true, // use SSL
    auth: {
      user: mailUser === '' ? testAccount.user : mailUser, // generated ethereal user
      pass: mailPass === '' ? testAccount.pass : mailPass // generated ethereal password
    }
  })

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `<${from}>`, // sender address
    to: to, // list of receivers
    subject: title, // Subject line
    text: text // plain text body
  })

  console.log('Message sent: %s', info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}

function sendReqs (req, res, from, to, id, title, msg) {
  sendEmailTo(to, from, 'Hello, you have new request on pending', 'Hello, you have new request on pending, from ' + from)
  db.reqs.create({
    todoId: id,
    todoTitle: title,
    from: from,
    to: to,
    msg: msg,
    state: '0'
  }).then((d) => {
    return res.send(
      JSON.stringify({
        success: false,
        msg: 'we can\'t .'
      })
    )
  })
}

function FinishReqs (req, res, id) {
  db.reqs.findOne({
    where: {
      id: id
    }
  }).then((r) => {
    if (!r) {
      return res.send(
        JSON.stringify({
          success: false,
          msg: 'we can\'t .'
        })
      )
    }
    return db.reqs.update({
      state: '2'
    }, {
      where: { id: id }
    }).then((d) => {
      return res.send(
        JSON.stringify({
          success: true,
          msg: 'updated the reqs'
        })
      )
    })
  })
}

function removeReqs (req, res, id) {
  return db.reqs.destroy({
    where: {
      id: id
    }
  }).then(() => {
    return res.send(
      JSON.stringify({
        success: true,
        msg: 'removed the reqs'
      })
    )
  })
}

function AcceptReqs (req, res, id, email) {
  db.reqs.findOne({
    where: {
      id: id
    }
  }).then((r) => {
    if (!r) {
      return res.send(
        JSON.stringify({
          success: false,
          msg: 'we can\'t .'
        })
      )
    }
    const to = r.get('to')
    const from = r.get('from')
    sendEmailTo(from, to, 'You Get Accepted on the request from ' + to, 'Happy, You have new Project to work on now')

    const todolistID = r.get('todoId')
    return db.reqs.update({
      state: '1'
    }, {
      where: { id: id }
    }).then((d) => {
      return db.todolist.destroy({
        where: {
          id: todolistID
        }
      }).then(() => {
        return res.send(
          JSON.stringify({
            success: true,
            msg: 'updated the reqs'
          })
        )
      })
    })
  })
}

module.exports = {
  api: function (req, res) {
    const { GETreq } = req.query
    const email = req.session.user
    const UserType = req.session.type
    // console.log('s', req.session)
    if (!email) {
      return res.send(
        JSON.stringify({
          success: false,
          msg: 'you are not login, login soon and true again'
        })
      )
    }
    if (!UserType) {
      return res.send(
        JSON.stringify({
          success: false,
          msg: 'you are not login, login soon and true again'
        })
      )
    }

    switch (GETreq) {
      case 'addItem':
        var {
          title,
          type
        } = req.query
        addItem(req, res, title, email, type)
        break
      case 'checkOn':
        var { id } = req.query
        checkState(req, res, id, 'true', email)
        break
      case 'checkOff':
        var { id } = req.query
        checkState(req, res, id, 'false', email)
        break
      case 'getAllMyItems':
        const ItemType = UserType === 'customer' ? email : null
        getItems(req, res, ItemType)
        break
      case 'getAllMyRequest':
        getAllMyRequest(req, res, email, UserType)
        break
      case 'AcceptReqs':
        var { id } = req.query
        AcceptReqs(req, res, id, email)
        break
      case 'removeReqs':
        var { id } = req.query
        removeReqs(req, res, id)
        break
      case 'FinishReqs' :
        var { id } = req.query
        FinishReqs(req, res, id)
        break
      case 'sendReqs':
        var {
          id,
          title,
          msg,
          to
        } = req.query
        sendReqs(req, res, email, to, id, title, msg)
        break
    }
  }
}
