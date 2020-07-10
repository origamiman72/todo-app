import React, { Component } from 'react';
import auth0Client from '../Auth';
import Task from './Task';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import FlipMove from "react-flip-move"
// import DatePicker from 'react-datepicker';
// import DayPicker from 'react-day-picker';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import TextField from '@material-ui/core/TextField';
import CategoryMenu from '../components/categoryMenu/categoryMenu';

import moment from 'moment';
import MomentUtils from "@date-io/moment";
import Paper from '@material-ui/core/Paper';
import 'remove-focus-outline';

// import DayPickerInput from 'react-day-picker/DayPickerInput'

// import 'react-day-picker/lib/style.css';

// import "react-datepicker/dist/react-datepicker.css";
import './TaskList.scss';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

class TaskList extends Component {

    constructor(props) {
        super(props);

        this.addTask = this.addTask.bind(this);
        this.editTask = this.editTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.completeTask = this.completeTask.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
        this.filterTasks = this.filterTasks.bind(this);

        this.state = {
            taskList: [],
            uncompletedTasks: [],
            completedTasks: [],
            selectedDate: null,
            categories: [],
            selectedCategory: null,
            filters: [],
        }
    }

    updateDate(date) {
        this.setState({
            selectedDate: date,
        })
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

    async componentDidMount() {
        if (!auth0Client.isAuthenticated()) {
            this.props.history.push('/');
            return;
        }

       // const tasks = (await axios.get(`http://localhost:8081/app/${auth0Client.getProfile().sub}`)).data;
        const tasks = await axios.post(`http://localhost:8081/app/`, {
            userId: auth0Client.getProfile().sub,
        }, {
            headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
        });

        var completedTasks = [];
        var uncompletedTasks = [];
        for (var i = 0; i < tasks.data.todoTasks.length; i++) {
            if (tasks.data.todoTasks[i].completed) {
                completedTasks.push(tasks.data.todoTasks[i]);
            } else {
                uncompletedTasks.push(tasks.data.todoTasks[i]);
            }
        }

        this.setState({
            taskList: tasks.data.todoTasks,
            uncompletedTasks: uncompletedTasks,
            completedTasks: completedTasks,
        })

        this.getCategories();
    }

    // Refreshes tasks shown on this page.
    async refreshTasks() {
        if (!auth0Client.isAuthenticated()) {
            this.props.history.push('/');
            return;
        }
        const tasks = await axios.post(`http://localhost:8081/app/`, {
            userId: auth0Client.getProfile().sub,
        }, {
            headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
        });

        var completedTasks = [];
        var uncompletedTasks = [];
        for (var i = 0; i < tasks.data.todoTasks.length; i++) {
            if (tasks.data.todoTasks[i].completed) {
                completedTasks.push(tasks.data.todoTasks[i]);
            } else {
                uncompletedTasks.push(tasks.data.todoTasks[i]);
            }
        }

        this.setState({
            taskList: tasks.data.todoTasks,
            uncompletedTasks: uncompletedTasks,
            completedTasks: completedTasks,
        })
    }

    // Deletes a task.
    async deleteTask(key) {
        if (!auth0Client.isAuthenticated()) {
            this.props.history.push('/');
            return;
        }
        const attempt = await axios.post('http://localhost:8081/app/deleteTask', {
            key: key,
        }, {
            headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
        });
        this.refreshTasks();
    }

    // Edits a task.
    async editTask(key, newContent, newCategory) {
        if (!auth0Client.isAuthenticated()) {
            this.props.history.push('/');
            return;
        }
        const attempt = await axios.post('http://localhost:8081/app/editTask', {
            key: key,
            newContent: newContent,
            newCategory: newCategory,
        }, {
            headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
        });
        this.refreshTasks();
    }

    // Marks a task as completed.
    async completeTask(key) {
        if (!auth0Client.isAuthenticated()) {
            this.props.history.push('/');
            return;
        }
        const attempt = await axios.post('http://localhost:8081/app/completeTask', {
            key: key,
        }, {
            headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
        });
        this.refreshTasks();
    }

    // Adds a new task
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
            console.log(newTask)
            // console.log(newTask);

            await axios.post('http://localhost:8081/app/newTask', newTask,
            {
                headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
            });

            this.refreshTasks();

            this._inputElement.value = null;
            this.setState({
                selectedDate: null,
                selectedCategory: null,
            })
        }
    }

    setCategory(category) {
        this.setState({
            selectedCategory: category,
        })
    }

    async addCategory(e) {
        if (!auth0Client.isAuthenticated()) {
            this.props.history.push('/');
            return;
        }
        e.preventDefault();
        if (this._inputcategory !== "") {
            console.log(this._inputcategory);
            await axios.post('http://localhost:8081/app/addCategory',
            {
                userId: auth0Client.getProfile().sub,
                newCategory: this._inputcategory.value,
            },
            {
                headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
            });

            this._inputcategory.value = null;
            this.getCategories();
        }

    }

    async removeCategory(category) {
        if (!auth0Client.isAuthenticated()) {
            this.props.history.push('/');
            return;
        }
        await axios.post('http://localhost:8081/app/removeCategory',
        {
            userId: auth0Client.getProfile().sub,
            category: category,
        },
        {
            headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}`}
        });

        this.getCategories();
        this.refreshTasks();
    }

    async filterTasks(category) {
        var uncompletedTasks = this.state.taskList.filter(
            task => task.completed == false
        );
        var completedTasks = this.state.taskList.filter(
            task => task.completed == true
        );

        if (this.state.filters[0] == category) {
            this.setState({
                uncompletedTasks: uncompletedTasks,
                completedTasks: completedTasks,
                filters: [],
            })
            return;
        }
        var filters = [category];
        uncompletedTasks = uncompletedTasks.filter(task => task.category == category);
        completedTasks = completedTasks.filter(task => task.category == category);
        this.setState({
            uncompletedTasks: uncompletedTasks,
            completedTasks: completedTasks,
            filters: filters,
        })
    }


    render() {
        if (this.state.uncompletedTasks.length === 0) {
            var uncompletedTasksRender = <div>You've completed all of your tasks!</div>
        } else {
            var uncompletedTasksRender = (
                            this.state.uncompletedTasks.map(
                                (task) => <Task 
                                            displayMenu
                                            displayDate
                                            key={task.date} 
                                            edit={this.editTask}
                                            complete={this.completeTask} 
                                            remove={this.deleteTask} 
                                            categories={this.state.categories}
                                            task={task} />
                                            )
            )
        }

        return (
            <div id="main-Cont" className="container">
                <div>
                    <Paper className="sidebar" variant="outlined">
                        <form onSubmit={this.addCategory} required id="addCategoryForm" className="card-1 horiz form-group">
                            <TextField onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    this.addCategory(ev);
                                }
                            }} className="textField" inputRef={(b) => this._inputcategory = b} label="Add new Category" variant="standard" />
                            <Button variant="outlined" className="submitButton" color="primary" onClick={this.addCategory}>Add</Button>
                        </form>
                        <ul className="categories">
                        <FlipMove duration={250} easing="ease">
                            {this.state.categories.map(
                                (category, index) => <li key={index} className={"align-items-center sidebarCategory d-flex justify-content-between " + (this.state.filters.indexOf(category) > -1 && "selected")}>
                                                <div className="categoryLabel clickable" onClick={() => this.filterTasks(category)}>{category}</div>
                                                {/* <i class="fas fa-times" onClick={() => this.removeCategory(category)}></i> */}
                                                <IconButton className="hover-only" aria-controls="delete-category" onClick={() => this.removeCategory(category)} >
                                                    <CloseIcon />
                                                </IconButton>
                                                </li>
                                )}
                                </FlipMove>
                        </ul>
                    </Paper>
                </div>
                <div className="main">
                <Paper variant="outlined" className="TaskList">
                    <div>
                        <form onSubmit={this.addTask} id="addTaskForm" className="card-1 form-group">
                            <TextField onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    this.addTask(ev);
                                }
                            }} className="addNewTask" required id="standard-basic" inputRef={(a) => this._inputElement = a} label="Add new Task" variant="standard" />
                            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>

                            <KeyboardDatePicker
                                className="DatePicker"
                                value={this.state.selectedDate}
                                onChange={(date) => this.updateDate(date)}
                                label="Due Date"
                                format="MM/DD/yyyy"
                            />
                            </MuiPickersUtilsProvider>
                            <Button variant="contained" className="submitButton" color="primary" onClick={this.addTask}>Add</Button>
                            <CategoryMenu label={this.state.selectedCategory} setCategory={this.setCategory} categories={this.state.categories} />
                        </form>
                    </div>
                    <ul>
                        <FlipMove duration={250} easing="ease">
                        {uncompletedTasksRender}
                        </FlipMove>
                    </ul>
                    <div>{(this.state.completedTasks.length != 0) && "Completed"}</div>
                    <ul>
                        <FlipMove duration={250} easing="ease">
                        {
                            this.state.completedTasks.map(
                                (task) => <Task  
                                            displayMenu
                                            displayDate
                                            key={task.date} 
                                            complete={this.completeTask} 
                                            remove={this.deleteTask} 
                                            categories={this.state.categories}
                                            task={task} />
                                            )
                        }
                        </FlipMove>

                    </ul>
                </Paper>
                </div>
            </div>
        )
    }
}

export default withRouter(TaskList);