import React, { Component} from 'react';
import '../css/App.css';
import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';
import {without, findIndex} from 'lodash';

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      myName: 'Ray',
      myAppointments: [],
      lastIndex: 0,
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'desc', 
      queryText: ''
    };
    this.deleteAppointment = this.deleteAppointment.bind(this)
    this.toggleForm = this.toggleForm.bind(this)
    this.addAppointment = this.addAppointment.bind(this)
    this.changeOrder= this.changeOrder.bind(this)
    this.searchApts = this.searchApts.bind(this)
    this.updateInfo = this.updateInfo.bind(this)
  }

  componentDidMount(){
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map((item) => {
          item.aptId = this.state.lastIndex
          this.setState({lastIndex: this.state.lastIndex + 1})
          return item
        })
        this.setState({
          myAppointments : apts
        })
      })
  }

  toggleForm(){
    this.setState({
      formDisplay: !this.state.formDisplay
    })
    console.log(this.state.formDisplay)
  }

  deleteAppointment(apt){
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);
    this.setState({
      myAppointments:tempApts
    })
  }

  addAppointment(apt){
    let tempApts = this.state.myAppointments; 
    apt.aptId = this.state.lastIndex
    tempApts.unshift(apt)
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1
    })
  }

  updateInfo(name, value, id){
    console.log(name, value, id)
    let tempApts = this.state.myAppointments
    let aptIndex = findIndex(this.state.myAppointments, {
      aptId: id
    })
    // tempApts[aptIndex][name]  =value;
    this.setState({
      myAppointments: tempApts
    })
  }

  changeOrder(order, dir){
    this.setState({
      orderBy: order,
      orderDir: dir
    })
  }

  searchApts(query){
    console.log(query)
    this.setState({
      queryText: query
    })
    
    
  }

  render() {
    console.log(this.state)
    let order;
    let filteredApts = this.state.myAppointments;
    if(this.state.orderDir == 'asc'){
      order = 1;
    } else {
      order = -1
    }

    console.log(filteredApts)
    filteredApts = filteredApts.sort((a,b)=> {
      if(a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()){
        return -1 * order;
      } else {
        return 1 * order
      }
    }).filter(eachItem => {
      return (
        eachItem['petName'].toLowerCase().includes(this.state.queryText.toLowerCase())  ||
        eachItem['ownerName'].toLowerCase().includes(this.state.queryText.toLowerCase())  ||
        eachItem['aptNotes'].toLowerCase().includes(this.state.queryText.toLowerCase()) 
      ) 
    })

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments 
                formDisplay = {this.state.formDisplay} toggleForm={this.toggleForm}
                addAppointment = {this.addAppointment}/>
                <SearchAppointments 
                orderBy={this.state.orderBy}
                orderDir={this.state.orderDir}
                changeOrder  ={this.changeOrder}
                searchApts = {this.searchApts}/>
                <ListAppointments appointments ={filteredApts}
                deleteAppointment={this.deleteAppointment}
                updateInfo = {this.updateInfo}/>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default App;
