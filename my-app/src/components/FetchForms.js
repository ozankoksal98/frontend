import React, { Component, useEffect } from 'react';
import Element from "./Element"
import Spinner from "react-bootstrap/Spinner"

export default class FetchForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            forms: null,
            empty: false,
            ids: [],
            user_ids: [],
            channel_ids: [],
            checkAll: false,
            checkedList: []
        };
        this.url = this.props.url + "&formID=" + this.props.formID
        this.type = this.props.type
        this.handler = this.handler.bind(this)
    }

    componentWillReceiveProps(newProps) {
        if (newProps.checkAll) {
            this.setState(() => {
                return {
                    checkedList: this.state.checkedList.map(() => true),
                }
            })
        } else if (newProps.unCheckAll) {
            this.setState(() => {
                return {
                    checkedList: this.state.checkedList.map(() => false),
                }
            })
        }
        if(newProps.checkedList!=null){
            this.setState(() => {
                return {
                    checkedList: newProps.checkedList
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
        if (str != "[]") {
            var json = JSON.parse(str)
            var keys = []
            var channel_ids = []
            var users = []
            var checkedList = []
            var parsedData = []
            json.forEach(i => {
                if (i["type"] == "0") {
                    channel_ids.push(i["id"])
                } else if (i["type"] == "1") {
                    users.push(i["id"])
                } else {
                    keys.push(i["id"])
                }
                checkedList.push(false)
                parsedData.push(i)
            });
            this.setState({ checkedList: checkedList, ids: keys, channel_ids: channel_ids, user_ids: users, parsedData:parsedData , data: str, loading: false })
        } else {
            this.setState({ loading: false, empty: true, forms: null })
            console.log("empty")
        }

    }

    handler(t) {
        var newChecked = this.state.checkedList.map(a => a)
        newChecked[t] = !newChecked[t]
        this.setState(() => {
            return {
                checkedList: newChecked
            }
        })
    }

    createList() {
        if (this.state === {
            loading: true,
            forms: null,
            empty: false
        }) {
            return <Spinner animation="border" />
        } else if (this.state.loading == false && this.state.empty == true) {
            return "There are no " + this.props.type + " for this form"
        } else {
            var json = JSON.parse(this.state.data)
            var comp = []
            var keys = []
            var channel_ids = []
            var users = []
            var t = 0
            json.forEach(i => {
                if (i["type"] == "0") {
                    comp.push(<Element n={t} checked={this.state.checkedList[t]} id={i["id"]} text={" #" + i["title"]} type={this.type} handler={this.props.handler} handler2={this.handler} />)
                    channel_ids.push(i["id"])
                } else if (i["type"] == "1") {
                    comp.push(<Element n={t} checked={this.state.checkedList[t]} id={i["id"]} text={" @" + i["title"]} type={"users"} handler={this.props.handler} handler2={this.handler} />)
                    users.push(i["id"])
                } else {
                    comp.push(<Element n={t} checked={this.state.checkedList[t]} id={i["id"]} text={i["title"]} type={this.type} handler={this.props.handler} handler2={this.handler} />)
                    keys.push(i["id"])
                }
                t++
            });
        }

        return comp
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
                    color :"#000033",
                    backgroundColor:"#ffcf66",
                    paddingLeft: "30px",
                    borderColor: "#cc8b00",
                    borderWidth: "thin",
                    borderStyle: "solid",
                    borderTopRightRadius: "10px",
                    borderTopLeftRadius: "10px",
                    width: 450,
                    marginBottom: "-2px",
                    
                }}>
                    <h3>{title}</h3>
                </div>
                <div style={{
                    borderColor: "#cc8b00",
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

                    <div style={{ paddingLeft: "20px" ,paddingRight: "20px" ,backgroundColor:"#fff7e6"}}>
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
                        {this.state.loading ? "" : this.createList()}
                    </div>
                </div>
            </div>
        )
    }
}