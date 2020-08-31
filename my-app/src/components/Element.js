import React, { Component } from 'react';

export default class Element extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="checkbox" style={{
                borderTopStyle: "solid",
                borderTopColor: "#cc8b00",
                borderTopWidth: "1px",
            }}>
                <div className="input-group-prepend">
                    <label>
                        <input type="checkbox" checked={this.props.checked} onClick={() => {
                            this.props.handler2(this.props.n)
                            this.props.handler(this.props.id, this.props.type)
                        }
                        } />
                        {" " + this.props.text + " "}</label></div>
            </div>
        )
    }
}