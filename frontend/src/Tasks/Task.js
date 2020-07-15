import React, { Component } from 'react';
import DateUI from '../components/dateUI/dateUI';
import './Task.scss';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import CategoryMenu from '../components/categoryMenu/categoryMenu';
import Checkbox from '@material-ui/core/Checkbox';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { TextField } from '@material-ui/core';

function TaskMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={props.className}>
      {/* <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Open Menu
      </Button> */}
        <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            <MoreHorizIcon />
        </IconButton>
    <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        >
        {!props.complete &&
            <MenuItem onClick={() => {
                handleClose();
                props.edit();
            }}>Edit Task</MenuItem>
        }
        <MenuItem onClick={() => {
                handleClose();
                props.remove();
            }}>Delete Task</MenuItem>
      </Menu>
    </div>
  );
}

class Task extends Component {
    constructor(props) {
        super(props);

        console.log(this.props)
        this.deleteSelf = this.deleteSelf.bind(this);
        this.completeSelf = this.completeSelf.bind(this);
        this.cancelEditing = this.cancelEditing.bind(this);
        this.editSelf = this.editSelf.bind(this);
        this.startEditing = this.startEditing.bind(this);
        this.editCategory = this.editCategory.bind(this);
        this.updateDate = this.updateDate.bind(this);
        var date = this.props.task.dueDate && new Date(this.props.task.dueDate);

        this.state = {
            editing: false,
            // date: this.props.task.date,
            // dueDate = this.props.task.dueDate,
            complete: this.props.task.completed,
            content: this.props.task.content,
            _id: this.props.task._id,
            category: this.props.task.category,
            month: date && (date.getMonth() + 1),
            day: date && date.getDate(),
            year: date && date.getFullYear(),
            date: date,
        }
    }

    updateDate(date) {
        this.setState({
            date: date,
        })
    }

    completeSelf() {
        this.setState({
            complete: !this.state.complete
        })
        this.props.complete(this.state._id);
    }

    deleteSelf() {
        this.props.remove(this.state._id);
    }

    startEditing() {
        this.setState({
            editing: true,
        });
    }

    editSelf(e) {
        e.preventDefault();
        if(this._inputElement.value == "") {
            return;
        }
        this.props.edit(this.state._id, this._inputElement.value, this.state.category, this.state.date);
        var date = this.state.date && new Date(this.state.date);
        this.setState({
            editing: false,
            content: this._inputElement.value,
            month: date && (date.getMonth() + 1),
            day: date && date.getDate(),
            year: date && date.getFullYear(),
            category: this.category,
        });
    }

    cancelEditing(e) {
        this.category = null;
        this._inputElement.value = "";
        this.setState({
            editing: false,
        })
    }

    editCategory(category) {
        this.category = category;
        this.setState({});
    }


    render() {
        let content;
        if (this.state.editing) {
            content = (
                <form onSubmit={this.editSelf} className="row" id="editTaskForm" className="form-group">
                    {/* <input className="" placeholder="Edit this task."
                                        defaultValue={this.state.content} 
                                        ref={(a) => this._inputElement = a}
                        type="text"></input> */}
                        <TextField onKeyPress={(ev) => {
                            if (ev.key === 'Enter') {
                                this.editSelf(ev);
                            }
                            }} 
                            className="editTaskContent"
                            placeholder="Edit this Task."
                            defaultValue={this.state.content}
                            required id="standard-basic"
                            inputRef={(a) => this._inputElement = a}
                            label="Edit Task"
                            variant="standard" />
                    {/* <DatePicker showTimeSelect placeholderText="Due Date" selected={this.state.selectedDate} onChange={(date) => {this.updateDate(date)}} /> */}
                            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                        <KeyboardDatePicker
                            clearable
                            className="DatePicker"
                            value={this.state.date}
                            onChange={(date) => this.updateDate(date)}
                            label="Due Date"
                            format="MM/DD/yyyy"
                        />
                        </MuiPickersUtilsProvider>
                    <Button color="primary" onClick={this.editSelf}>Save</Button>
                    <Button color="primary" onClick={this.cancelEditing}>Cancel</Button>
                </form>
            )
        } else {
            content = <div className="row left-align"><Checkbox onChange={() => this.completeSelf()} checked={this.state.complete} />
                <div className="taskContent">
                    {this.state.content}
                {this.props.displayDate && this.state.date &&
                    <DateUI
                        month={this.state.month}
                        day={this.state.day}
                        year={this.state.year}
                    />
                }
                </div>
            </div>
        }

        return (
            <li className={this.state.complete ? "completed" : ""}>
                <div key={this.state.date} className="Task">
                    <div>
                    {content}
                    </div>
                    <div className="right-aligned row">

                    {this.state.editing &&
                        <CategoryMenu className="categoryLabel" label={this.category || this.state.category} setCategory={this.editCategory} categories={this.props.categories} />
                    }
                    {!this.state.editing &&
                        <div className="categoryLabel">{this.state.category}</div>
                    }
                    {this.props.displayMenu &&
                        <TaskMenu className="categoryLabel" complete={this.state.complete} edit={this.startEditing} remove={this.deleteSelf} />
                    }
                    </div>
                </div>
            </li>
        )
    }
}

export default Task;