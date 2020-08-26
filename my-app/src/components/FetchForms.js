import React, { Component, useEffect } from 'react';
import Element from "./Element"
import Spinner from "react-bootstrap/Spinner"
import Elements from "./Elements"

export default class FetchForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            forms: null,
            empty: false,
            ids: null,
            user_ids: [],
            channel_ids: [],
            checkAll: false,
            checkedList: []
        };
        this.url = this.props.url + "&formID=" + this.props.formID
        this.type = this.props.type
    }

    componentWillReceiveProps(newProps) {
        if (this.type == "channels") {
            console.log("new props:", newProps, this.props)
            this.setState(() => {
                return {
                    checkAll: newProps.checkAll
                }
            })
        }

    }


    async componentDidMount() {
        const response = await fetch(this.url, {
            method: 'GET',
            redirect: 'follow'
        })
        const data = await response.json()
        const str = JSON.stringify(data)
        console.log(str)
        if (str != "[]") {
            const json = JSON.parse(str)
            var comp = []
            var keys = []
            var channel_ids = []
            var users = []
            var checkedList = []
            json.forEach(i => {
                if (i["type"] == "0") {
                    checkedList.push(false)
                    comp.push(<Element checked={this.props.checkAll} id={i["id"]} text={" #" + i["title"]} type={this.type} handler={this.props.handler} />)
                    channel_ids.push(i["id"])
                } else if (i["type"] == "1") {
                    checkedList.push(false)
                    comp.push(<Element checked={this.state.checkAll} id={i["id"]} text={" @" + i["title"]} type={"users"} handler={this.props.handler} />)
                    users.push(i["id"])
                } else {
                    checkedList.push(false)
                    comp.push(<Element checked={this.state.checkAll} id={i["id"]} text={i["title"]} type={this.type} handler={this.props.handler} />)
                    keys.push(i["id"])
                }
            });
            this.setState({ channel_ids: channel_ids, user_ids: users, ids: keys, checkedList: checkedList, forms: comp, loading: false })
        } else {
            this.setState({ loading: false, empty: true, forms: null })
            console.log("empty")
        }

    }


    render() {
        var element
        var title
        if (this.props.type == "fields") {
            title = "Choose fields"
        } else if (this.props.type == "channels") {
            title = "Choose channels or users"
        } else {
            title = "Choose submissions"
        }
        if (this.state === {
            loading: true,
            forms: null,
            empty: false
        }) {
            element = <Spinner animation="border" />
        } else if (this.state.loading == false && this.state.empty == true) {
            element = "There are no " + this.props.type + " for this form"
        } else {
            element = this.state.forms
        }
        return (
            <div>
                <div style={{
                    paddingLeft: "30px",
                    borderColor: "#5dbcd2",
                    borderWidth: "thin",
                    borderStyle: "solid",
                    borderTopRightRadius: "10px",
                    borderTopLeftRadius: "10px",
                    width: 450,
                    marginBottom: "-2px"
                }}>
                    <h3>{title}</h3>
                </div>
                <div style={{
                    borderColor: "#5dbcd2",
                    borderWidth: "thin",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                    borderStyle: "solid",
                    width: 450,
                    height: 200,
                    overflow: "auto",
                    overflowX: "hidden",
                    textAlign: "justify",
                    marginBottom: "20px",
                }}>

                    <div style={{ paddingLeft: "20px" }}>
                        <div className="checkbox" style={{
                            marginTop: '2px',
                            marginBottom: "-1px"
                        }}>
                            <div className="input-group-prepend">
                                <label><input type="checkbox" checked={this.props.checkAll} onChange={() => {
                                    this.props.handlerAll(this.props.type)
                                }} />Select All</label>
                            </div>
                        </div>
                        {element}
                    </div>
                </div>
            </div>
        )
    }
}