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
    console.log(props);
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
      body =  <div>Logged in as {this.state.properties.user.username+"  "}<Image src={"https://cdn.discordapp.com/avatars/" + this.state.properties.user.id + "/" + this.state.properties.user.avatar + ".png"} onClick={() => console.log(this.props)} width={40} height={40} roundedCircle /></div>
    }

    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
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