import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

import './css/index.css';
import './css/discord.css';
import 'highlight.js/styles/solarized-dark.css';
import { Component } from 'react';




class index extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  render() {
    return (<div>
 <App embedData = {this.props.embedData}/>
    </div>

     
    );
  }
}

export default index;