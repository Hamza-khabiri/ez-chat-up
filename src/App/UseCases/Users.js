[{
    id: '/#12poiajdspfoif',
    name: 'Uzair_Capazyte'
}]
  
class Users {
    constructor () {
      this.users = [];
    }

    Add( id, name, room ) {
      const user = { id, name, room };
      this.users.push( user );

      return user;
    }

    Remove( id ) {
      var user = this.Get( id );
  
      if ( user ) {
        this.users = this.users.filter( user => user.id !== id );
      }
  
      return user;
    }

    Get( id ) {
      return this.users.filter( user => user.id === id )[ 0 ]
    }

    GetList(room) {      
      var users = this.users.filter( user => user.room === room );
      var list = users.map( user => user.name );
  
      return list;
    }
}

module.exports = { Users }
