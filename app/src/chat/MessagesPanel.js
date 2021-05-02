import React from 'react';
import { Message } from './Message';
import { BiArrowFromLeft } from "react-icons/bi";

export class MessagesPanel extends React.Component {
    state = { input_value: '' };
    send = () => {
        if (this.state.input_value && this.state.input_value != '') {
            this.props.onSendMessage(this.props.channel.id, this.state.input_value);
            this.setState({ input_value: '' });
        }
    };

    handleInput = e => {
        this.setState({ input_value: e.target.value });
    };

    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.send();
        }
    };

    render() {

        let list = <div className="no-content-message"></div>;
        if (this.props.channel && this.props.channel.messages) {
            list = this.props.channel.messages.map(m => <Message key={m.id} id={m.id} senderName={m.senderName} text={m.text} />);
        }

        return (
            <div className='messages-panel'>
                <div className="header">
                    <BiArrowFromLeft className="arrow"/>
                    Live Chat
                </div>
                <div className="meesages-list">{list}</div>
                {this.props.channel &&
                    <div className="messages-input">
                        <input type="text" onChange={this.handleInput} onKeyDown={this._handleKeyDown} placeholder={"Send a chat..."} value={this.state.input_value} />
                        <button onClick={this.send}>Send</button>
                    </div>
                }
            </div>);
    }

}
