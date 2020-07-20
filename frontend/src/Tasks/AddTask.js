import React, { Component } from 'react';
import { TextField, Button, Paper } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import CategoryMenu from '../components/categoryMenu/categoryMenu';
import auth0Client from '../Auth';
import axios from 'axios';

class AddTask extends Component {

    // Required props: category list, refresh Task
    constructor(props) {
        super(props);

        this.addTask = this.addTask.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.setCategory = this.setCategory.bind(this);

        if (this.props.date) {
            var date = moment(this.props.date);
        } else {
            var date = null;
        }

        this.state = {
            selectedDate: date,
            selectedCategory: null,
        }
    }

    async addTask(e) {
        if (!auth0Client.isAuthenticated()) {
            this.props.history.push('/');
            return;
        }
        e.preventDefault();
        // console.log(auth0Client.getProfile());
        if (this._inputElement !== "") {
            var newTask = {
                userId: auth0Client.getProfile().sub,
                content: this._inputElement.value,
                dueDate: this.state.selectedDate,
                category: this.state.selectedCategory,
            }

            await axios.post('http://localhost:8081/app/newTask', newTask,
            {
                headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
            });

            this._inputElement.value = null;
            this.setState({
                selectedDate: null,
                selectedCategory: null,
            })
            this.props.refreshTasks(newTask);

        }
    }

    updateDate(date) {
        this.setState({
            selectedDate: date,
        })
    }

    setCategory(category) {
        this.setState({
            selectedCategory: category,
        })
    }

    render() {
        return (
            <Paper variant="outlined" id="addTaskForm" className={this.props.className}>
                <form onSubmit={this.addTask} className="card-1 form-group">
                    <TextField onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            this.addTask(ev);
                        }
                    }} className="addNewTask" id="standard-basic" inputRef={(a) => this._inputElement = a} label="Add new Task" variant="standard" />
                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>

                    <KeyboardDatePicker
                        clearable
                        className="DatePicker"
                        value={this.state.selectedDate}
                        onChange={(date) => this.updateDate(date)}
                        label="Due Date"
                        format="MM/DD/yyyy"
                    />
                    </MuiPickersUtilsProvider>
                    <Button variant="contained" className="submitButton" color="primary" onClick={this.addTask}>Add</Button>
                    <CategoryMenu label={this.state.selectedCategory} setCategory={this.setCategory} categories={this.props.categories} />
                </form>
            </Paper>
        )
    }
}

export default AddTask;