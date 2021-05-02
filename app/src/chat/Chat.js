import React from 'react';
import './chat.scss';
import { MessagesPanel } from './MessagesPanel';
import socketClient from "socket.io-client";

// CHANGE ME : On deployment
const SERVER = "http://localhost:8080";
// const SERVER = "http://34.66.210.81:8080";

export class Chat extends React.Component {

    constructor() {
        super();
        this.state = {
            channels: {name: "Turbo Pottery 101", participants: 0, id: 1, sockets: Array(0)},
            socket: null,
            channel: {name: "Turbo Pottery 101", participants: 0, id: 1, sockets: Array(0)}
        };
    }

    socket;
    componentDidMount() {
        this.configureSocket();
    }

    configureSocket = () => {
        var socket = socketClient(SERVER);
        socket.on('connection', () => {
            if (this.state.channel) {
                console.log(this.state.channel.id);
                this.socket.emit('channel-join', this.state.channel.id);
            }
        });

        socket.on('message', message => {
            var c = this.state.channel;
            if (!c.messages) {
                c.messages = [message];
            } else {
                c.messages.push(message);
            }
            console.log(message);
            console.log(c.messages);
        });
        this.socket = socket;
    }

    handleSendMessage = (channel_id, text) => {
        this.socket.emit('send-message', { channel_id, text, senderName: this.socket.id, id: Date.now() });
    }

    render() {

        return (
            <div className='chat-app'>
                <MessagesPanel onSendMessage={this.handleSendMessage} channel={this.state.channel} />
            </div>
        );
    }
}