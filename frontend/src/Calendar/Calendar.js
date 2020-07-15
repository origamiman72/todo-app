import React, { Component } from 'react';
import moment from 'moment';
import './calendar.scss';
import auth0Client from '../Auth';
import axios from 'axios';

class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            taskList: [],
            dateObject: moment(),
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
        })
    }

    firstDayOfMonth = () => {
        let dateObject = this.state.dateObject;
        let firstDay = moment(dateObject).startOf("moment").format("d");
        return firstDay;
    }

    render() {
        var weekdayshort = moment.weekdaysShort();
        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(
            <td className="calendar-day empty">{""}</td>
            )
        }
        let daysInMonth = [];
        for (let d = 0; d < this.state.dateObject.daysInMonth(); d++) {
            daysInMonth.push(
                <td key={d} className="calendar-day">
                    {d}
                </td>
            );
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

        for (let i = 0; i < this.state.taskList.length; i++) {
            var curr = this.state.taskList[i];
            if (curr.dueDate && moment(curr.dueDate).month() === this.dateObject.month()) {
                console.log("nut");
            }
        }

        return (
            // <div>Calendar</div>
            <div className="container d-flex justify-content-center">
                <div className="calendar">
                    <table className="calendar-day">
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