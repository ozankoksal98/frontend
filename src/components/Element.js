import React, { Component } from 'react';

export default class Element extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checked :this.props.checked
        };
    }

    componentWillReceiveProps(newProps){
        console.log("new props in element",this.state)
        this.setState(()=>{
            return{
                checked : this.newProps.checked
            }
        })
    }



    render() {
        return (
            <div className="checkbox" key = {this.props.checked} style={{
                borderTopStyle: "solid",
                borderTopColor: "#fb8016",
                borderTopWidth: "2px",

            }}>
                <div className="input-group-prepend">
                    <label>
                        <input type="checkbox" checked={this.state.checked} onChange={() => {
                            this.setState(prevState=>{
                                return{
                                    checked : !prevState.checked
                                }
                            })
                            this.props.handler(this.props.id, this.props.type)
                        }
                        } />
                        {" " + this.props.text + " "}</label></div>
            </div>
        )
    }
}