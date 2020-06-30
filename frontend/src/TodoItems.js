import React from "react";
import FlipMove from "react-flip-move"

class TodoItems extends React.Component {
    constructor(props) {
        super(props);

        this.createTasks = this.createTasks.bind(this);
    }

    delete(key) {
        this.props.delete(key);
    }

    createTasks(item) {
        return (
            <li onClick={() => this.delete(item.key)}
            key={item.key}
            class="clickable">{item.task}</li>
        )
    }

    render() {
        var todoEntries = this.props.entries;
        var listItems = todoEntries.map(this.createTasks);

        return (
            <ul className="taskList">
                <FlipMove duration={250} easing="ease">
                        {listItems}
                </FlipMove>
            </ul>
        )
    }
}

export default TodoItems;