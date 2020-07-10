import React, { Component } from 'react';
import auth0Client from '../Auth';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Task from '../Tasks/Task';
import './week.scss';
import Day from './Day';


class Week extends Component {
    constructor(props) {
        super(props);

        this.filterTasks = this.filterTasks.bind(this);
        this.refreshTasks = this.refreshTasks.bind(this);
        this.completeTask = this.completeTask.bind(this);

        this.state = {
            sunday: [],
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
        }
    }

    async componentDidMount() {
        this.refreshTasks();
    }

    async refreshTasks() {
        if (!auth0Client.isAuthenticated()) {
            this.props.history.push('/');
            return;
        }

        const tasks = await axios.post(`http://localhost:8081/app`, {
            userId: auth0Client.getProfile().sub,
        }, {
            headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
        });

        var taskList = tasks.data.todoTasks;
        this.filterTasks(taskList);
    }

    filterTasks(taskList) {

        var sunday = [];
        var monday = [];
        var tuesday = [];
        var wednesday = [];
        var thursday = [];
        var wednesday = [];
        var thursday = [];
        var friday = [];
        var saturday = [];

        for (var i = 0; i < taskList.length; i++) {
            var curr = taskList[i];
            if (curr.dueDate !== null) {
                var now = moment();
                var input = moment(curr.dueDate);
                var isThisWeek = (now.isoWeek() == input.isoWeek());

                if (isThisWeek) {
                    switch(input.day()) {
                        case 0:
                            sunday.push(curr);
                            break;
                        case 1:
                            monday.push(curr);
                            break;
                        case 2:
                            tuesday.push(curr);
                            break;
                        case 3:
                            wednesday.push(curr);
                            break;
                        case 4:
                            thursday.push(curr);
                            break;
                        case 5:
                            friday.push(curr);
                            break;
                        case 6:
                            saturday.push(curr);
                            break;
                    }
                }

                this.setState({
                    sunday: sunday,
                    monday: monday,
                    tuesday: tuesday,
                    wednesday: wednesday,
                    thursday: thursday,
                    friday: friday,
                    saturday: saturday,
                })

            }
        }
    }

    taskFunction = (task) => <Task
                                key={task.date} 
                                edit={this.editTask}
                                complete={this.completeTask} 
                                remove={this.deleteTask} 
                                task={task} />

    async completeTask(key) {
        const attempt = await axios.post('http://localhost:8081/app/completeTask', {
            key: key,
        }, {
            headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
        });
        this.refreshTasks();
    }

    render() {

        return (
          <div className="container">
            <div className="weekly">
              {/* <div className="day">Saturday
                        <ul>
                            { this.state.saturday.map(this.taskFunction) }
                        </ul>
                    </div> */}
              <Day day="Sunday" key="1" complete={this.completeTask} tasks={this.state.sunday} />
              <Day day="Monday" key="2" complete={this.completeTask} tasks={this.state.monday} />
              <Day day="Tuesday" key="3" complete={this.completeTask} tasks={this.state.tuesday} />
              <Day day="Wednesday" key="4" complete={this.completeTask} tasks={this.state.wednesday} />
              <Day day="Thursday" key="5" complete={this.completeTask} tasks={this.state.thursday} />
              <Day day="Friday" key="6" complete={this.completeTask} tasks={this.state.friday} />
              <Day day="Saturday" key="7" complete={this.completeTask} tasks={this.state.saturday} />
            </div>
          </div>
        );
    }

}

export default Week;