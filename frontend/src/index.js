import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import TodoItems from "./TodoItems"
import * as serviceWorker from './serviceWorker';

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.task,
      dueDate: props.due,
    }
  }

  render() {
    return (
          <div class="Task" key={new Date().getMilliseconds}>
        {this.state.task} {this.state.dueDate}
      </div>
    )
  }
}

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    this.addTask = this.addTask.bind(this);
    this.deleteItem = this.deleteItem.bind(this);

    this.state = {
      tasks: [],
    };
  }

  addTask(e) {
    if (this._inputElement.value !== "") {
      var newItem = {
        task: this._inputElement.value,
        key: Date.now(),
      };

      this.setState((prevState) => {
        return {
          tasks: prevState.tasks.concat(newItem)
        };
      });

      this._inputElement.value = "";
    }

    console.log(this.state.tasks);
    e.preventDefault();
  }

  renderTask(task, due) {
    return (
      <Task
        task={task}
        due={due}
      />
    )
  }

  deleteItem(key) {
    var filteredItems = this.state.tasks.filter(function (task) {
      return (task.key !== key);
    });

    this.setState({
      tasks: filteredItems,
    })
  };

  render() {

    return (
      <div class="container">
        <div class="TaskList">
          <div>
            <form onSubmit={this.addTask}>
              <input placeholder="Add new Task" ref={(a) => this._inputElement = a}
                type="text"></input>
              <button type="submit">Add</button>
            </form>
          </div>
          {/* {this.renderTask("nut", 10)}
          {this.renderTask("but", 10)} */}
          <TodoItems entries={this.state.tasks}
                     delete={this.deleteItem} />
        </div>
      </div>
    )
  }
  
}

// ===========================================

// ReactDOM.render(
//   <TaskList />,
//   document.getElementById('root'),
// );

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
  );
  serviceWorker.unregister();