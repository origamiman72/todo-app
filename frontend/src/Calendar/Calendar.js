import React, { Component } from 'react';
import moment from 'moment';
import './calendar.scss';
import auth0Client from '../Auth';
import axios from 'axios';
import Task from '../Tasks/Task';
import MiniTask from '../Tasks/MiniTask';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { Paper, TextField, Button } from '@material-ui/core';
import CategoryMenu from '../components/categoryMenu/categoryMenu';
import AddTask from '../Tasks/AddTask';

class AddCalendarTask extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    async componentDidMount() {
        this.getCategories();
    }

    async getCategories() {
        if (!auth0Client.isAuthenticated()) {
            this.props.history.push('/');
            return;
        }

        const categories = await axios.post(`http://localhost:8081/app/getCategories`, {
            userId: auth0Client.getProfile().sub,
        }, {
            headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
        });

        console.log("categories", categories);

        this.setState({
            categories: categories.data.categories,
        })
    }

    render() {
        return (
            <div className="fullScreen">
                <div className="dark-background" onClick={this.props.exitAddTask}></div>
                <AddTask date={this.props.date} refreshTasks={this.props.addTask} className="addTask" categories={this.state.categories}/>
            </div>
        )
    }

}

class Calendar extends Component {
    constructor(props) {
        super(props);

        this.addTask = this.addTask.bind(this);
        this.exitAddTask = this.exitAddTask.bind(this);

        var now = moment();

        this.state = {
            taskList: [],
            dateObject: now,
            month: now.month(),
            year: now.year(),
        }
    }

    async componentDidMount() {
        if (!auth0Client.isAuthenticated()) {
            this.props.history.push('/');
            return;
        }

        const tasks = await axios.post(`http://localhost:8081/app/`, {
            userId: auth0Client.getProfile().sub,
        }, {
            headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
        });

        this.setState({
            taskList: tasks.data.todoTasks,
            addingTask: false,
        })
    }

    addTask(task) {
        var tasks = this.state.taskList.slice();
        tasks.push(task);

        this.setState({
            taskList: tasks,
            addingTask: false,
        })
    }

    firstDayOfMonth = () => {
        let dateObject = this.state.dateObject;
        let firstDay = moment(dateObject).startOf("month").format("d");
        return firstDay;
    }

    exitAddTask() {
        this.setState({
            addingTask: false,
        })
    }

    render() {
        var weekdayshort = moment.weekdaysShort();
        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(
            <td className="empty">{""}</td>
            )
        }

        let relevantTasks = [];
        for (let i = 0; i < this.state.taskList.length; i++) {
            var curr = this.state.taskList[i];
            if (curr.dueDate) {
                if (moment(curr.dueDate).month() === this.state.dateObject.month()) {
                    relevantTasks.push(curr);
                }
            }
        }

        let daysInMonth = [];
        var overdue = true;
        for (let i = 0; i < this.state.dateObject.daysInMonth(); i++) {
            var todayTasks = [];
            for (let j = 0; j < relevantTasks.length; j++) {
                var currTask = relevantTasks[j];
                if (moment(currTask.dueDate).date() == i + 1) {
                    todayTasks.push(currTask);
                }

            }
            let currentDay = i + 1 == moment().date() ? "today" : "";   
            if (currentDay) {
                overdue = false;
            }
            daysInMonth[i] =
                <td key={i + 1} /*className={`calendar-day ${currentDay}`} */>
                <div className={`calendar-day ${currentDay}`}>
                    <div className="d-flex justify-content-between day-header">
                        <div>{i + 1}</div>
                        <IconButton size="small" className="hover-only" onClick={() => {
                            var curr = moment().year(this.state.year).month(this.state.month).date(i + 1);
                            console.log(curr);
                            this.setState({
                                addingTask: true,
                                addTaskDate: curr,
                            })
                            console.log(this.state);
                        }}>
                            <AddIcon />
                        </IconButton>
                    </div>
                    <ul>
                        {todayTasks.map((task) =>
                        <li><MiniTask
                            overdue={overdue}
                            content={task.content}
                            key={task._id}
                            id={task._id}
                            complete={task.completed} />
                        </li>)}
                    </ul>
                </div>
            </td>
        }

        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];
        totalSlots.forEach((row, i) => {
            if (i % 7 !== 0) {
                cells.push(row);
            } else {
                rows.push(cells);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                rows.push(cells);
            }
        });

        let weekdayshortname = weekdayshort.map(day => {
            return (
                <th key={day} className="weekday-label">
                    {day}
                </th>
            )
        });

        let daysinmonth = rows.map((d, i) => {
            return <tr>{d}</tr>
        })

        return (
            // <div>Calendar</div>
            <div className="container d-flex justify-content-center">
                {this.state.addingTask && <AddCalendarTask addTask={this.addTask} exitAddTask={this.exitAddTask} date={this.state.addTaskDate} />}
                <div className="calendar">
                    <div className="calendar-month">{this.state.dateObject.format("MMMM")}</div>
                    <table className="">
                        <thead>
                            <tr>{weekdayshortname}</tr>
                        </thead>
                        <tbody>{daysinmonth}</tbody>
                    </table>
                </div>
            </div>
        )
    }
}


export default Calendar;