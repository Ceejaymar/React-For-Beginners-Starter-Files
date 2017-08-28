import React, { Component } from 'react';
import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends Component {
  constructor() {
    super()
    this.addFish = this.addFish.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.loadSampleFish = this.loadSampleFish.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFish = this.removeFish.bind(this);

    this.state = {
      fishes: {},
      order: {}
    }
  }

  componentWillMount() {
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    })

    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

    if(localStorageRef){
      this.setState({
        order: JSON.parse(localStorageRef)
      })      
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order))
  }

  addFish(fish){
    const fishes = {...this.state.fishes};
    const timeStamp = Date.now();
   
    fishes[`fish-${timeStamp}`] = fish;
    this.setState({ fishes });
  }

  updateFish(key, updatedFish) {
    const fishes = {...this.state.fishes};
    fishes[key] = updatedFish;
    this.setState({ fishes })
  }

  removeFish(key) {
    const fishes = {...this.state.fishes};
    fishes[key] = null;

    this.setState({ fishes })
  }

  loadSampleFish() {
    this.setState({
      fishes: sampleFishes
    })
  }

  addToOrder(key) {
    const order = {...this.state.order};
    order[key] = order[key] + 1 || 1;

    this.setState({ order })
  }

  removeFromOrder(key) {
    const order = {...this.state.order};
    delete order[key];

    this.setState({ order })
  }

  render() {
    return ( 
      // <StorePicker />
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            {
              Object
                .keys(this.state.fishes)
                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
            }
          </ul>
        </div>
        <Order 
          fishes={this.state.fishes} 
          order={this.state.order} 
          params={this.props.params} 
          removeFromOrder={this.removeFromOrder} 
        /> 
        <Inventory 
          addFish={this.addFish} 
          loadSampleFish={this.loadSampleFish} 
          fishes={this.state.fishes}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
        /> 
      </div>
    )
  }
}

App.propTypes = {
  params: React.PropTypes.object.isRequired
}

export default App;