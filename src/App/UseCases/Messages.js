var moment = require('moment');

class Messages {
  messageList = [];

  constructor(){}

  Get() {
    return this.messageList;
  }

  Generate = (from, text) => {
    const message = {
      from,
      text,
      createdAt: moment().valueOf()
    };

    if( from !== 'Admin' )
      this.messageList.push( message );

    return message;
  };
}

module.exports = { Messages };
