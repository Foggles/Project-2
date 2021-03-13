const db = require('./../models');

const configs = require('./../config/config.json');

//this add items to the window
function addItem(req, res, title, email, type) {
 // console.log('new code add item', req, res, title, email, type)
 db.todolist
  .create({
   title: title,
   email: email,
   checked: 'false',
   type: type,
  })
  .then((error, result) => {
   // console.log('cc', result);
   if (!result) {
    console.log('add new error');

    //  console.log(error)
    return res.send(
     JSON.stringify({
      success: false,
      msg: "we can't add item, right now, come later",
     })
    );
   } else {
    console.log('new res', result);
    return res.send(
     JSON.stringify({
      success: true,
      msg: 'Done, Add the item',
     })
    );
   }
  });
}

function getAllMyRequest(req, res, email, UserType) {
 if (UserType == 'customer') {
  db.reqs
   .findAll({
    where: {
     to: email,
    },
   })
   .then(async (results) => {
    if (!results) {
     return res.send(
      JSON.stringify({
       success: false,
       msg: "we can't add item, right now, come later",
      })
     );
    } else {
     // passing token into cookies
     return res.send(JSON.stringify(results));
    }
   });
 } else {
  db.reqs
   .findAll({
    where: {
     from: email,
    },
   })
   .then(async (results) => {
    if (!results) {
     return res.send(
      JSON.stringify({
       success: false,
       msg: "we can't add item, right now, come later",
      })
     );
    } else {
     // passing token into cookies
     return res.send(JSON.stringify(results));
    }
   });
 }
}

function getItems(req, res, email) {
 console.log('get items', email);
 if (email) {
  db.todolist
   .findAll({
    where: {
     email: email,
    },
   })
   .then(async (results) => {
    if (!results) {
     return res.send(
      JSON.stringify({
       success: false,
       msg: "we can't add item, right now, come later",
      })
     );
    } else {
     // passing token into cookies
     return res.send(JSON.stringify(results));
    }
   });
 } else {
  db.todolist
   .findAll({
    where: {
     checked: 'true',
    },
   })
   .then(async (results) => {
    if (!results) {
     return res.send(
      JSON.stringify({
       success: false,
       msg: "we can't add item, right now, come later",
      })
     );
    } else {
     // passing token into cookies
     return res.send(JSON.stringify(results));
    }
   });
 }
}

module.exports = {
 api: function (req, res) {
  const { GETreq } = req.query;
  const email = req.session.user;
  const UserType = req.session.type;
  console.log('s', req.session);
  if (!email) {
   return res.send(
    JSON.stringify({
     success: false,
     msg: 'you are not login, login soon and true again',
    })
   );
  }
  if (!UserType) {
   return res.send(
    JSON.stringify({
     success: false,
     msg: 'you are not login, login soon and true again',
    })
   );
  }

  switch (GETreq) {
   case 'addItem':
    var { title, type } = req.query;
    addItem(req, res, title, email, type);
    break;
   case 'checkOn':
    var { id } = req.query;
    checkState(req, res, id, 'true', email);
    break;
   case 'checkOff':
    var { id } = req.query;
    checkState(req, res, id, 'false', email);
    break;
   case 'getAllMyItems':
    const ItemType = UserType === 'customer' ? email : null;
    getItems(req, res, ItemType);
    break;
   case 'getAllMyRequest':
    getAllMyRequest(req, res, email, UserType);
    break;
  }
 },
};
