import React, { Component } from 'react';
import axios from 'axios';
import auth0Client from '../Auth';

class MiniTask extends Component {

    constructor(props) {
        super(props);

        this.complete = this.complete.bind(this);

        this.state = {
            content: props.content,
            complete: props.complete,
            id: props.id,
        }
    }

    async complete(key) {
        console.log(this.state);
        if (!auth0Client.isAuthenticated()) {
            this.props.history.push('/');
            return;
        }
        const attempt = await axios.post('http://localhost:8081/app/completeTask', {
            key: key,
        }, {
            headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
        });

        this.setState({
            complete: !this.state.complete,
        })
    }

    render() {

        var completeClass = this.state.complete ? "completed" : "";
        return (
            <div className={`mini-task clickable ${completeClass}`}
                onClick={() => this.complete(this.state.id)}>
                {this.state.content}
            </div>
        )
    }
}

export default MiniTask;