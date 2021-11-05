Vue.component('message', {
    props: ['message'],
    template:
    '<ul id="message">' +
        '<li id="message-author">{{message.author}}</li>' +
        '<li id="message-time">{{message.time}}</li>'  +
        '<li id="message-content">{{message.text}}</li>'  +
    '</ul>'
})
Vue.component('friend-request', {
    props: ['request'],
    template:
    '<ul id="request">' +
        '<li>placeholder</li>' +
        '<li id="accept" v-on:click="acceptRequest()">Accept</li>'+
        '<li id="deny" v-on:click=$emit("deny-request")>Deny</li>'+
    '</ul>'
})
var toUser =''
var socket = io.connect('http://localhost:3000');
var app = new Vue({
    el: '#app',
    data: {
        messageContent: '',
        friends: [
            {
                text:'example.5',
                id: 5
            }
        ],
        messages: [],
        incoming_requests: [
            {
                id: 5,
                user_id1: 4,
                user_id2: 3
            },
            {
                id: 5,
                user_id1: 4,
                user_id2: 3
            }

        ]
    },
    mounted: function (){
        socket.on('connect', function(){
            socket.emit('authentication', Cookies.get('user'));
            socket.on('authenticated', function() {
              
              socket.on('return_message', (user, data) => {
                 app.messages.push({
                      author: user,
                      text: data,
                      time: getCurrentTime()
                  })
              })
              socket.on('sendFriends',(data) => {
                  data.forEach(element => {
                      console.log(element.username)
                  })
                  data.forEach(element => {
                      app.friends.push({
                          text: element.username + '.'+element.id, 
                          id: element.id
                      })
          
                  })
                  //toUser = app.friends[0].id
              })
            })
          });

    },
    methods: {
        send: function() {
            if (app.messageContent == "" || app.recipient == "") {
                return;
            }
            socket.emit('send_message', toUser, app.messageContent)
        },
        setFriend(data) {
            console.log(data)
            toUser = data
        },
        acceptRequest() {
            console.log('cool')
        },
        denyRequest() {
            console.log('not cool')
        }
    }
})
function getCurrentTime() {
    return getFullDate()
}
function getFullDate() {
    const d = new Date();
    const time = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
    return time;
}