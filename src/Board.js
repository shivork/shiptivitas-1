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
        'in-progress': clients.filter(client => client.status && client.status === 'in-progress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      },

      taskName: '',
      taskDescription: '',
      taskStatus: 'backlog',

    }
    this.swimlanes = {
      backlog: React.createRef(),
      'in-progress': React.createRef(),
      complete: React.createRef(),
    }
    this.handleInputChange = (event) => {

      this.setState({
        [event.target.name]: event.target.value
      });
    }
    this.addTask = () => {
      const newTask = {
        id: Date.now().toString(),
        name: this.state.taskName,
        description: this.state.taskDescription,
        status: this.state.taskStatus,
      };

      const updatedClients = {
        ...this.state.clients
      };

      console.log("taskStatus =", this.state.taskStatus);
      console.log("updatedClients =", updatedClients);
      updatedClients[this.state.taskStatus].push(newTask);

      this.setState({
        clients: updatedClients,
        taskName: '',
        taskDescription: '',
        taskStatus: 'backlog',
      });

    };
  }
  componentDidMount() {
    this.drake = Dragula(
     [
       this.swimlanes.backlog.current,
       this.swimlanes["in-progress"].current,
       this.swimlanes.complete.current
     ],
     {
       removeOnSpill: false,
       revertOnSpill: true
     }
     );

    this.drake.on("drag", (el, source) => {
        el.setAttribute("data-old-status", source.dataset.status);
      });

    this.drake.on("drop", (el, target) => {
      const cardId = el.dataset.id;

      console.log("element =", el);
      console.log("oldStatus =", el.getAttribute("data-old-status"));

      const oldStatus = el.getAttribute("data-old-status");
      const newStatus = target.dataset.status;

      let updatedClients = {
        backlog: [...this.state.clients.backlog],
        "in-progress": [...this.state.clients["in-progress"]],
        complete: [...this.state.clients.complete]
      };

      const movedCard = updatedClients[oldStatus].find(
        client => String(client.id) === String(cardId)
      );
      console.log("oldStatus =", oldStatus);
      console.log("updatedClients =", updatedClients);

      if (!movedCard) {
        console.log("NOT FOUND ---- stopping");
        return;
      }
      console.log("cardId:", cardId);
      console.log("oldStatus:", oldStatus);
      console.log("newStatus:", newStatus);
      console.log(updatedClients[oldStatus]);
      console.log("movedCard:", movedCard);
      console.log(updatedClients[oldStatus]);


      setTimeout(() => {
        el.classList.remove(
          "Card-grey",
          "Card-blue",
          "Card-green"
        );

        if (newStatus === "backlog") {
          el.classList.add("Card-grey");
        } else if (newStatus === "in-progress") {
          el.classList.add("Card-blue");
        } else {
          el.classList.add("Card-green");
        }
      }, 50);



      updatedClients[oldStatus] =
        updatedClients[oldStatus].filter(
          client => String(client.id) !== cardId
        );

      const newMovedCard = { ...movedCard, status: newStatus };
      updatedClients[newStatus].push(newMovedCard);
      this.state.clients = updatedClients;

      // this.setState({
      //   clients: updatedClients
      // });

    });
  }

  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],

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
              {this.renderSwimlane('In-Progress', this.state.clients['in-progress'], this.swimlanes['in-progress'])}
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
