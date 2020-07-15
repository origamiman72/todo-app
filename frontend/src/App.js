import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Question from './Question/Question';
import Questions from './Questions/Questions';
import Callback from './Callback';
import NewQuestion from './NewQuestion/NewQuestion';
import SecuredRoute from './SecuredRoute/SecuredRoute';
import TaskList from './Tasks/TaskList';
import Week from './Week/Week';
import Calendar from './Calendar/Calendar';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Route exact path='/app' component={TaskList}/>
        <Route exact path='/week' component={Week}/>
        <Route exact path='/calendar' component={Calendar}/>
        <Route exact path='/question/:questionId' component={Question}/>
        <Route exact path='/callback' component={Callback} />
        <SecuredRoute path='/new-question' component={NewQuestion} />
      </div>
    )
  }
}

export default App;