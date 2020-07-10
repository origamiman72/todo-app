import React, { Component } from 'react';
import DateUI from '../components/dateUI/dateUI';
import './Task.scss';
import IconButton from '@material-ui/core/Button';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import CategoryMenu from '../components/categoryMenu/categoryMenu';
import Checkbox from '@material-ui/core/Checkbox';

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
        var date = this.props.task.dueDate && new Date(this.props.task.dueDate);

        this.state = {
            editing: false,
            date: this.props.task.date,
            // dueDate = this.props.task.dueDate,
            complete: this.props.task.completed,
            content: this.props.task.content,
            _id: this.props.task._id,
            category: this.props.task.category,
            month: date && (date.getMonth() + 1),
            day: date && date.getDate(),
            year: date && date.getFullYear(),
            date: date,
            // dueDate: this.props.dueDate && Date(this.props.dueDate),
        }
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
        this.props.edit(this.state._id, this._inputElement.value, this.state.category);
        this.setState({
            editing: false,
            content: this._inputElement.value,
            category: this.state.category,
        });
    }

    cancelEditing(e) {
        this.setState({
            editing: false,
        })
    }

    editCategory(category) {
        this.setState({
            category: category,
        })
    }


    render() {
        let content;
        if (this.state.editing) {
            content = (
                <form onSubmit={this.editSelf} id="editTaskForm" className="form-group">
                    <input className="" placeholder="Edit this task."
                                        defaultValue={this.state.content} 
                                        ref={(a) => this._inputElement = a}
                        type="text"></input>
                    {/* <DatePicker showTimeSelect placeholderText="Due Date" selected={this.state.selectedDate} onChange={(date) => {this.updateDate(date)}} /> */}
                    <Button color="primary" onClick={this.editSelf}>Save</Button>
                    <Button color="primary" onClick={this.cancelEditing}>Cancel</Button>
                </form>
            )
        } else {
            content = <div className="row"><Checkbox onChange={() => this.completeSelf()} checked={this.state.complete} />
            <div className="taskContent">{this.state.content}</div></div>
        }

        return (
            <li className={this.state.complete && "completed"}>
                <div key={this.state.date} className="Task">
                    {content}
                    <div className="right-aligned row">

                    {this.state.editing &&
                        <CategoryMenu className="categoryLabel" label={this.state.category} setCategory={this.editCategory} categories={this.props.categories} />
                    }
                    {!this.state.editing &&
                        <div className="categoryLabel">{this.state.category}</div>
                    }
                    {this.props.displayDate && this.state.date &&
                        <DateUI
                            month={this.state.month}
                            day={this.state.day}
                            year={this.state.year}
                        />
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