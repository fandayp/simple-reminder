import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addReminder, deleteReminder, clearReminder } from '../actions';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import Icon from 'react-icons-kit';
import { remove } from 'react-icons-kit/fa/remove';
import { calendar } from 'react-icons-kit/fa/calendar';
import { pencil } from 'react-icons-kit/fa/pencil';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: '',
      dueDate: '',
      errMessage: '',
    }
  }

  onAddReminder() {
    if (this.state.todo !== '' && this.state.dueDate !== '') {
      this.props.addReminder(this.state.todo, this.state.dueDate);
      this.setState({todo: '', dueDate: '', errMessage: ''});
    } else if (this.state.todo === '' && this.state.dueDate !== '') {
      this.setState({errMessage: "Reminder's title can't be empty"});
    } else if (this.state.todo !== '' && this.state.dueDate === '') {
      this.setState({errMessage: "Wrong/incomplete date input. Please recheck"})
    } else {
      this.setState({errMessage: "Can't create undefined reminder. Please fill the form"});
    }
  }

  onDeleteReminder(id) {
    this.props.deleteReminder(id);
  }

  onDeleteAllReminder() {
    this.props.clearReminder();
  }

  onChangeToDo(event) {
    this.setState({todo: event.target.value});
  }

  onChangeDueDate(event) {
    if (moment() < moment(event.target.value))
      this.setState({dueDate: event.target.value, errMessage: ''});
    else
      this.setState({errMessage: "Can't enter date in the past"});
  }

  onDeleteToDo() {
    this.setState({todo: ''});
  }

  clearAllReminders() {
    const { reminders } = this.props;
    let ret = null;

    if (reminders.length > 0) {
      ret = <button
        className="btn btn-danger"
        onClick={() => this.onDeleteAllReminder()}
      >
        Delete All
      </button>
    } else {
      ret = null;
    }

    return ret;
  }

  renderReminders() {
    const { reminders } = this.props;

    return (
      <ul className="list-group col-sm-4 todos">
        {
          reminders.map(reminder => {
            return (
              <li key={reminder.id} className="list-group-item">
                <div className="list-item">
                  <div>{reminder.todo}</div>
                  <div><em>{moment(new Date(reminder.dueDate)).fromNow()}</em></div>
                </div>
                <div className="list-item delete-button"><Icon onClick={() => this.onDeleteReminder(reminder.id)} icon={remove} size={12} /></div>
              </li>
            )
          })
        }
      </ul>
    )
  }

  render() {
    return (
      <div className="App">
        <div className="title">
          Simple Reminder
        </div>
        <div className="form-inline reminder-form">
          <div className="form-group">
            <div className="form-control form-wrapper">
              <Icon icon={pencil} className="pencil-icon" size={12}/>
              <input
                className="form-todo"
                placeholder="I have to...."
                onChange={(event) => this.onChangeToDo(event)}
                value={this.state.todo}
              />
              <Icon className="delete-todo" icon={remove} onClick={() => this.onDeleteToDo()} size={10}/>
            </div>
            <div className="form-control form-wrapper">
              <Icon icon={calendar} className="cal-icon" size={12}/>
              <input
                type="datetime-local"
                className="form-date"
                onChange={(event) => this.onChangeDueDate(event)}
                value={this.state.dueDate}
              />
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.onAddReminder()}
          >
            Add Reminder
          </button>
          <p className="errMessage">{this.state.errMessage}</p>
        </div>
        {this.renderReminders()}
        {this.clearAllReminders()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    reminders: state
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addReminder, deleteReminder, clearReminder}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
