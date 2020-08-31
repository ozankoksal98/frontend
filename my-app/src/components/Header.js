import React, { Component } from 'react';
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import Form from "react-bootstrap/Form"
import Image from "react-bootstrap/Image"
import Spinner from "react-bootstrap/Spinner"
import 'bootstrap/dist/css/bootstrap.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: this.props.auth,
      properties: this.props,
      loading:this.props.loading
    };
  }
  componentWillReceiveProps(newProps) {
    this.setState(() => {
      return {
        auth: newProps.auth,
        loading:newProps.loading,
        properties: newProps
      }
    })

  }
  render() {
    var body
    if(!this.state.auth && !this.state.loading){
      body= ""
    }else if(this.state.auth && this.state.loading){
      body = <Spinner animation="border" />
    }else if(this.state.auth && !this.state.loading) {
      body =  <div style = {{color:"#0d0d26",fontWeight:500,marginRight:"20px"}}>Logged in as {this.state.properties.user.username+"  "}<Image src={"https://cdn.discordapp.com/avatars/" + this.state.properties.user.id + "/" + this.state.properties.user.avatar + ".png"} onClick={() => console.log(this.props)} width={40} height={40} roundedCircle /></div>
    }

    return (
      <Navbar  style ={{backgroundColor:"#ffb566" ,height:"60px"}} expand="lg">
        <Navbar.Brand href="#home"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            

              <NavDropdown.Divider />
              
          </Nav>
          <Form inline>
            {body}
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header