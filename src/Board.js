import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(client => !client.status || client.status === 'backlog'),
        inProgress: clients.filter(client => client.status && client.status === 'in-progress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      },

      taskName: '',
      taskDescription: '',
      taskStatus: 'backlog',
      
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
    this.handleInputChange = (event) => {

    this.setState({
     [event.target.name]: event.target.value
      });
    }
  

  }
  getClients() {
    return [
      ['1','UI Design','Create dashboard layout','backlog'],
      ['2','Navbar','Build navigation menu','backlog'],
      ['3','Profile Page','Create user profile','backlog'],
      ['4','Dark Mode','Add dark theme','backlog'],
      ['5','Settings','Create settings panel','backlog'],
      ['6','Login Page','Build login screen','backlog'],
      ['7','React Setup','Install and run app','in-progress'],
      ['8','Task Board','Manage task cards','in-progress'],
      ['9','API Connect','Fetch backend data','in-progress'],
      ['10','Dashboard','Build main dashboard','in-progress'],
      ['11','Testing','Check app errors','complete'],
      ['12','Deploy App','Upload project online','complete'],
      ['13','Bug Fix','Solve UI problems','complete'],
      ['14','Responsive UI','Optimize for mobile','complete'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref}/>
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="task-form">
          <input
            type="text"
            name="taskName"
            placeholder="Task Name"
            value={this.state.taskName}
            onChange={this.handleInputChange}
           />
          <input
            type="text"
            name="taskDescription"
            placeholder="Description"
            value={this.state.taskDescription}
            onChange={this.handleInputChange}
          />

          <select
            name="taskStatus"
            value={this.state.taskStatus}
            onChange={this.handleInputChange}
          >
            <option value="backlog">Backlog</option>
            <option value="in-progress">In Progress</option>
            <option value="complete">Complete</option>
          </select>

          <button onClick={this.addTask}>
           Add Task
          </button>
        </div>
        
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
