import React, { Component } from 'react';
import Task from '../Tasks/Task';
import { makeStyles } from '@material-ui/core/styles';

import './week.scss';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardHeader } from '@material-ui/core';
import MiniTask from '../Tasks/MiniTask';


/**
 * ADD CATEGORIES FOR TASKS
 */

class Day extends Component {

    constructor(props) {
        super(props);
        console.log("but ", props);

        this.state = {
            tasks: this.props.tasks,
            day: this.props.day,
        }
    }


    // renderTask = (task) => <Task
    //                             displayMenu
    //                             key={task.date} 
    //                             edit={this.editTask}
    //                             complete={this.props.complete} 
    //                             remove={this.deleteTask} 
    //                             task={task} />
    renderTask = (task) => <MiniTask complete={task.complete} content={task.content} id={task._id} />
    

    render() {
        return (
            <Card className="day" variant="outlined">
                <CardHeader title={this.state.day}>{this.state.day}
                <Typography color="textSecondary" gutterBottom>
                    Word of the Day
                </Typography>
                    </CardHeader>
                <CardContent>
                    <ul>
                    {this.props.tasks.map((task) => this.renderTask(task))}
                    </ul>
                </CardContent>
            </Card>
        )
    }
}

export default Day;