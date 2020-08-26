import React from "react"
import Header from "./components/Header"
import { Container, Row, Col } from "react-bootstrap"
import FetchForm from "./components/FetchForms"
import FetchSelect from "./components/FetchSelect"
import Authentication from "./components/Authentication"
import Spinner from "react-bootstrap/Spinner"


class App extends React.Component {
    constructor(props) {
        super(props)
        this.token = "TvhDqhLCZDSzIFcAEZNb3hwXIWG5Kl";
        this.state = {
            count: 0,
            itemCheckedChannels: [],
            itemCheckedSubmissions: [],
            itemCheckedFields: [],
            itemCheckedUsers: [],
            selectAllChannels: false,
            selectAllFields: false,
            selectAllSubmissions: false,
            formPicked: false,
            chosenForm: null,
            auth: false,
            renderBody: false,
            loading: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleButtonSelect = this.handleButtonSelect.bind(this)
        this.handleButtonSubmit = this.handleButtonSubmit.bind(this)
        this.handleButtonAuthorize = this.handleButtonAuthorize.bind(this)
        this.handleChangeAll = this.handleChangeAll.bind(this)
        this.channelRef = React.createRef()
        this.fieldRef = React.createRef()
        this.submissionRef = React.createRef()
        //Things to do
        var urlParams = new URLSearchParams(window.location.search)
        if (urlParams.has("code")) {
            var urlencoded = new URLSearchParams();
            urlencoded.append("client_id", "745670953178234940");
            urlencoded.append("client_secret", "gjmRLNtEQd64SQI87y3tZKRrsAb4cI_2");
            urlencoded.append("grant_type", "authorization_code");
            urlencoded.append("code", urlParams.get("code"));
            urlencoded.append("redirect_uri", "http://localhost:3000/");
            urlencoded.append("scope", "identify");

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };
            this.state.loading = true
            this.state.auth = true

            fetch("https://discord.com/api/oauth2/token", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    var token = result["access_token"]
                    this.setState(() => {
                        return {
                            token: token,

                        }
                    })
                    var headers = new Headers();
                    headers.append("Content-Type", "application/json");
                    headers.append("Authorization", "Bearer " + this.token);

                    return fetch("https://discordapp.com/api/users/@me", {
                        method: 'GET',
                        headers: headers,
                        redirect: 'follow'
                    })
                }).then(resp => resp.json())
                .then(res => {
                    this.setState(() => {
                        return {
                            user: res,
                            loading: false
                        }
                    })
                })
                .catch(error => console.log('error', error));
        }

    }

    handleChange(id, type) {
        if (type == "channels") {
            this.setState(prevState => {
                var newArray = []
                newArray.push.apply(newArray, prevState.itemCheckedChannels)
                if (newArray.includes(id)) {
                    newArray.splice(newArray.indexOf(id), 1)
                    return {
                        selectAllChannels: false,
                        itemCheckedChannels: newArray
                    }
                } else {
                    newArray.push(id)
                    return {
                        itemCheckedChannels: newArray
                    }
                }
            })
        } else if (type == "fields") {
            this.setState(prevState => {
                var newArray = []
                newArray.push.apply(newArray, prevState.itemCheckedFields)
                if (newArray.includes(id)) {
                    newArray.splice(newArray.indexOf(id), 1)
                    return {
                        itemCheckedFields: newArray
                    }
                } else {
                    newArray.push(id)
                    return {
                        itemCheckedFields: newArray
                    }
                }
            })
        }
        else if (type == "submissions") {
            this.setState(prevState => {
                var newArray = []
                newArray.push.apply(newArray, prevState.itemCheckedSubmissions)
                if (newArray.includes(id)) {
                    newArray.splice(newArray.indexOf(id), 1)
                    return {
                        itemCheckedSubmissions: newArray
                    }
                } else {
                    newArray.push(id)
                    return {
                        itemCheckedSubmissions: newArray
                    }
                }
            })
        }
        else if (type == "users") {
            this.setState(prevState => {
                var newArray = []
                newArray.push.apply(newArray, prevState.itemCheckedUsers)
                if (newArray.includes(id)) {
                    newArray.splice(newArray.indexOf(id), 1)
                    return {
                        itemCheckedUsers: newArray
                    }
                } else {
                    newArray.push(id)
                    return {
                        itemCheckedUsers: newArray
                    }
                }
            })
        }
    }

    handleChangeAll(type) {
        if (type == "channels") {
            if (this.state.selectAllChannels) {
                //uncheck all boxes
                this.setState(()=>{
                    return{
                        itemCheckedChannels : [],
                        itemCheckedUsers :[]
                    }
                })
            }
            else {
                this.channelRef.current.state.channel_ids.forEach(element => {
                    var newArray = []
                    if (!this.state.itemCheckedChannels.includes(element)) {
                        this.handleChange(element, "channels")
                    }
                })
                this.channelRef.current.state.user_ids.forEach(element => {
                    var newArray = []
                    if (!this.state.itemCheckedUsers.includes(element)) {
                        this.handleChange(element, "users")
                    }
                })
            }
            this.setState(prevState => {
            return {
                selectAllChannels: !prevState.selectAllChannels
            }
        })
        } else if (type == "fields") {
            console.log(this.fieldRef.current.state)
        } else if (type == "submissions") {
            console.log(this.submissionRef.current.state)

        }
        
    }


    handleSelect(event) {
        var val = event.target.value
        this.setState(prevState => {
            return {
                chosenForm: val,
                formPicked: true
            }
        })
    }

    handleButtonSelect() {
        this.setState(prevState => {
            if (prevState.formPicked) {
                return {
                    itemCheckedChannels: [],
                    itemCheckedSubmissions: [],
                    itemCheckedFields: [],
                    formPicked: false,
                    chosenForm: null
                }
            }
        })
    }

    handleButtonSubmit() {
        console.log(this.state)
        var myHeaders = new Headers();
        var raw = JSON.stringify({
            "auth": this.state.auth,
            "username": this.state.user.username,
            "id": this.state.user.id,
            "guild_id": new URLSearchParams(window.location.search).get("guild_id"),
            "form": this.state.chosenForm,
            "channels": this.state.itemCheckedChannels,
            "fields": this.state.itemCheckedFields,
            "submissions": this.state.itemCheckedSubmissions,
            "users": this.state.itemCheckedUsers
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("http://localhost/curl/Discord/index.php", requestOptions)
            .then(response => response.text())
            .then(result => console.log("Post Result", result))
            .catch(error => console.log('error', error));
    }

    handleButtonAuthorize() {
        var params = {
            client_id: "745670953178234940",
            redirect_uri: window.location.href,
            response_type: 'code',
            scope: 'bot identify',
            permission: "8"
        };
        var urlParams = new URLSearchParams(params).toString()
        window.location.replace("https://discordapp.com/api/oauth2/authorize?" + urlParams)
    }

    render() {

        var body
        if (!this.state.auth && !this.state.loading) {
            body = <Authentication handler={this.handleButtonAuthorize} />
        } else if (this.state.auth && this.state.loading) {
            body = <Spinner animation="border" />
        } else if (this.state.auth && !this.state.loading) {
            body = <Container fluid>
                <Row>
                    <Col md={{ span: 3, offset: 1 }} justify="center">
                        {this.state.formPicked ? <div><button onClick={this.handleButtonSubmit}>
                            Submit
                </button> <button onClick={this.handleButtonSelect}>"Choose another form"</button></div> : <div><FetchSelect url={"http://localhost/curl/Discord/index.php?type=forms"} handler={this.handleSelect} /> </div>}
                        {!this.state.formPicked ? "" : <FetchForm ref={this.channelRef} checkAll = {this.state.selectAllChannels} url={"http://localhost/curl/Discord/index.php?type=channels"} type={"channels"} handler={this.handleChange} handlerAll={this.handleChangeAll} />}
                        {!this.state.formPicked ? "" : <FetchForm ref={this.fieldRef} formID={this.state.chosenForm} url={"http://localhost/curl/Discord/index.php?type=fields"} type={"fields"} handler={this.handleChange} handlerAll={this.handleChangeAll} />}
                        {!this.state.formPicked ? "" : <FetchForm  ref={this.submissionRef} formID={this.state.chosenForm} url={"http://localhost/curl/Discord/index.php?type=submissions"} type={"submissions"} handler={this.handleChange} handlerAll={this.handleChangeAll} />}
                    </Col>
                </Row>
            </Container>
        }


        return (
            <div>
                <div className="">
                    <Header loading={this.state.loading} auth={this.state.auth} user={this.state.user} />
                </div>
                <div>
                    {body}
                </div>
                <button onClick ={()=> console.log(this.state)}> State Check Button</button>
            </div>
        )
    }
}

export default App