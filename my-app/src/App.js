import React from "react"
import Header from "./components/Header"
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap"
import FetchForm from "./components/FetchForms"
import FetchSelect from "./components/FetchSelect"
import Authentication from "./components/Authentication"
import Spinner from "react-bootstrap/Spinner"
import History from "./components/FetchHistory"
import Button from "react-bootstrap/Button"
import AppEmbed from "./externalLibs/embedVisualizer/src/index"
import Form from "react-bootstrap/Form"

class App extends React.Component {
    constructor(props) {
        super(props)
        this.token = "";
        this.state = {
            count: 0,
            itemCheckedChannels: [],
            itemCheckedSubmissions: [],
            itemCheckedFields: [],
            itemCheckedUsers: [],
            selectAllChannels: false,
            selectAllFields: false,
            selectAllSubmissions: false,
            unselectAllChannels: false,
            unselectAllFields: false,
            unselectAllSubmissions: false,
            formPicked: false,
            chosenForm: null,
            auth: false,
            renderBody: false,
            loading: false,
            changed: false,
            previewData: null,
            notes: "",
            submitted: false,
            showErrorMessage: 1,
            error: false,
            focus:"history"
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleButtonSelect = this.handleButtonSelect.bind(this)
        this.handleButtonSubmit = this.handleButtonSubmit.bind(this)
        this.handleButtonAuthorize = this.handleButtonAuthorize.bind(this)
        this.handleChangeAll = this.handleChangeAll.bind(this)
        this.handleText = this.handleText.bind(this)
        this.handleHistory = this.handleHistory.bind(this)
        this.channelRef = React.createRef()
        this.fieldRef = React.createRef()
        this.submissionRef = React.createRef()
        this.formRef = React.createRef()
        this.historyRef = React.createRef()
        //Things to do
        var urlParams = new URLSearchParams(window.location.search)
        if (urlParams.has("code")) {
            var urlencoded = new URLSearchParams();
            urlencoded.append("client_id", "");
            urlencoded.append("client_secret", "");
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

    componentDidUpdate(prevProps, prevState) {
        if (this.state.changed && this.state.itemCheckedSubmissions.length != 0) {
            //get built message with post request
            var raw = this.createPostBody("preview")
            var myHeaders = new Headers();
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("http://localhost/curl/Discord/index.php", requestOptions)
                .then(response => response.text())
                .then(result => {
                    var str = '{"embed":' + result + '}'
                    this.setState(() => {
                        return {
                            previewData: JSON.parse(str),
                            changed: false
                        }
                    })
                })
                .catch(error => {
                    console.log('error', error)
                    this.setState(() => {
                        return {
                            changed: false
                        }
                    })
                });
        } else if (this.state.changed && this.state.itemCheckedSubmissions.length == 0) {
            this.setState(() => {
                return {
                    previewData: null,
                    changed: false
                }
            })
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
                        unselectAllChannels: false,
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
                        selectAllFields: false,
                        itemCheckedFields: newArray
                    }
                } else {
                    newArray.push(id)
                    return {
                        unselectAllFields: false,
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
                        selectAllSubmissions: false,
                        itemCheckedSubmissions: newArray
                    }
                } else {
                    newArray.push(id)
                    return {
                        unselectAllSubmissions: false,
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
                        selectAllChannels: false,
                        itemCheckedUsers: newArray
                    }
                } else {
                    newArray.push(id)
                    return {
                        unselectAllChannels: false,
                        itemCheckedUsers: newArray
                    }
                }
            })
        }
        this.setState(() => {
            return {
                changed: true,
                channelChecked:null,
                    submissionChecked:null,
                    fieldChecked:null
            }
        })
    }

    createPostBody(type) {
        var formData = this.formRef.current.state.parsedData.filter(i =>
            i.id === this.state.chosenForm
        )
        var channelData = this.channelRef.current.state.parsedData.filter(i =>
            this.state.itemCheckedChannels.includes(i.id)
        )
        var userData = this.channelRef.current.state.parsedData.filter(i =>
            this.state.itemCheckedUsers.includes(i.id)
        )
        var fieldData = this.fieldRef.current.state.parsedData.filter(i =>
            this.state.itemCheckedFields.includes(i.id)
        )
        var submissionData = this.submissionRef.current.state.parsedData.filter(i =>
            this.state.itemCheckedSubmissions.includes(i.id)
        )

        var raw = JSON.stringify({
            "auth": this.state.auth,
            "username": this.state.user.username,
            "id": this.state.user.id,
            "guild_id": new URLSearchParams(window.location.search).get("guild_id"),
            "form": formData,
            "channels": channelData,
            "fields": fieldData,
            "submissions": submissionData,
            "users": userData,
            "type": type,
            "notes": this.state.notes
        });
        return raw
    }

    handleChangeAll(type) {
        if (type == "channels") {
            if (this.state.selectAllChannels) {
                this.setState(() => {
                    return {
                        itemCheckedChannels: [],
                        itemCheckedUsers: [],
                        unselectAllChannels: true
                    }
                })
            }
            else {
                this.channelRef.current.state.channel_ids.forEach(element => {
                    if (!this.state.itemCheckedChannels.includes(element)) {
                        this.handleChange(element, "channels")
                    }
                })
                this.channelRef.current.state.user_ids.forEach(element => {
                    if (!this.state.itemCheckedUsers.includes(element)) {
                        this.handleChange(element, "users")
                    }
                })
            }
            this.setState(prevState => {
                return {
                    selectAllChannels: !prevState.selectAllChannels,
                }
            })
        } else if (type == "fields") {
            if (this.state.selectAllFields) {
                this.setState(() => {
                    return {
                        itemCheckedFields: [],
                        unselectAllFields: true
                    }
                })
            } else {
                this.fieldRef.current.state.ids.forEach(element => {
                    if (!this.state.itemCheckedFields.includes(element)) {
                        this.handleChange(element, "fields")
                    }
                })

            }
            this.setState(prevState => {
                return {
                    selectAllFields: !prevState.selectAllFields,
                }
            })

        } else if (type == "submissions") {
            if (this.state.selectAllSubmissions) {
                this.setState(() => {
                    return {
                        itemCheckedSubmissions: [],
                        unselectAllSubmissions: true
                    }
                })
            } else {
                this.submissionRef.current.state.ids.forEach(element => {
                    if (!this.state.itemCheckedSubmissions.includes(element)) {
                        this.handleChange(element, "submissions")
                    }
                })

            }
            this.setState(prevState => {
                return {
                    selectAllSubmissions: !prevState.selectAllSubmissions,
                }
            })
        }
        this.setState(() => {
            return {
                changed: true
            }
        })
    }

    handleText(e) {
        var letter = e.target.value
        this.setState(() => {
            return {
                notes: letter,
                changed: true
            }
        })
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
                    chosenForm: null,
                    previewData: null,
                    channelChecked:null,
                    submissionChecked:null,
                    fieldChecked:null

                }
            }
        })
    }

    handleButtonSubmit() {
        if (this.state.itemCheckedChannels.length == 0 && this.state.itemCheckedSubmissions.length == 0) {
            //show error message 1
            this.setState(() => {
                return {
                    showErrorMessage: 1,
                    error: true
                }
            })
        } else if (this.state.itemCheckedChannels.length == 0 && this.state.itemCheckedUsers == 0) {
            //show error message 2
            this.setState(() => {
                return {
                    showErrorMessage: 2,
                    error: true

                }
            })
        } else if (this.state.itemCheckedSubmissions.length == 0) {
            //show error message 3
            this.setState(() => {
                return {
                    showErrorMessage: 3,
                    error: true
                }
            })
        }
        else {
            var raw = this.createPostBody("submit")
            var myHeaders = new Headers();
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("http://localhost/curl/Discord/index.php", requestOptions)
                .then(response => response.text())
                .catch(error => console.log('error', error));
            setTimeout(() => {
                this.setState(prevState => { return { submitted: !prevState.submitted } })
            }, 2000);
        }

        setTimeout(() => {
            this.setState(()=> { return { error: false } })
        }, 2000);
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

    handleHistory(form_id, channel_ids, user_ids, field_ids, submission_ids,notes) {
        this.setState(()=>{return{focus:"preview"}})
        if(form_id!= this.state.chosenForm){
            this.setState(() => {
            return {
                itemCheckedChannels: [],
                itemCheckedSubmissions: [],
                itemCheckedFields: [],
                itemCheckedUsers:[],
                formPicked: false,
                chosenForm: null,
                previewData: null,
                notes:"",
                
            }
        })
        setTimeout(() => {
            this.setState(() => {
            return {
                formPicked: true,
                chosenForm: form_id,
                
            }
        })
        }, 500);
        }else{
            this.setState(() => {
                return {
                    itemCheckedChannels: [],
                    itemCheckedSubmissions: [],
                    itemCheckedFields: [],
                    itemCheckedUsers:[],
                    channelChecked: [],
                    fieldChecked: [],
                    submissionChecked: [],
                    notes:""
                }
            })
        }
        
        setTimeout(() => {
            this.setState(() => {
                return {
                    selectAllChannels: false,
                    selectAllFields: false,
                    selectAllSubmissions: false,
                    unselectAllChannels: false,
                    unselectAllFields: false,
                    unselectAllSubmissions: false,
                    
                }
            })
            channel_ids.forEach(element => {
                this.handleChange(element, "channels")
            });
            user_ids.forEach(element => {
                this.handleChange(element, "users")
            });
            field_ids.forEach(element => {
                this.handleChange(element, "fields")
            });
            submission_ids.forEach(element => {
                this.handleChange(element, "submissions")
            });
            var channels = this.channelRef.current.state.channel_ids.map(a => a)
            this.channelRef.current.state.user_ids.forEach(element => {
                channels.push(element)
            });
            var channelChecked = []
            var fieldChecked = []
            var submissionChecked = []

            channels.forEach(element => {
                if (this.state.itemCheckedChannels.includes(element) ||this.state.itemCheckedUsers.includes(element) ) {
                    channelChecked.push(true)
                } else {
                    channelChecked.push(false)
                }
            });

            this.fieldRef.current.state.ids.forEach(element => {
                if (this.state.itemCheckedFields.includes(element)) {
                    fieldChecked.push(true)
                } else {
                    fieldChecked.push(false)
                }
            });

            this.submissionRef.current.state.ids.map(a => a).forEach(element => {
                if (this.state.itemCheckedSubmissions.includes(element)) {
                    submissionChecked.push(true)
                } else {
                    submissionChecked.push(false)
                }
            });
            this.setState(() => {
                return {
                    channelChecked: channelChecked,
                    fieldChecked: fieldChecked,
                    submissionChecked: submissionChecked,
                    notes:notes,
                    
                }
            })
            console.log(this.state)
        }, 1500);
    }

    

    render() {
        var body
        var errorMessage
        var channels = <FetchForm checkedList={this.state.channelChecked} ref={this.channelRef} unCheckAll={this.state.unselectAllChannels} checkAll={this.state.selectAllChannels} url={"http://localhost/curl/Discord/index.php?type=channels"} type={"channels"} handler={this.handleChange} handlerAll={this.handleChangeAll} />
        var fields = <FetchForm checkedList={this.state.submissionChecked} ref={this.submissionRef} unCheckAll={this.state.unselectAllSubmissions} checkAll={this.state.selectAllSubmissions} formID={this.state.chosenForm} url={"http://localhost/curl/Discord/index.php?type=submissions"} type={"submissions"} handler={this.handleChange} handlerAll={this.handleChangeAll} />
        var submissions = <FetchForm checkedList={this.state.fieldChecked} ref={this.fieldRef} unCheckAll={this.state.unselectAllFields} checkAll={this.state.selectAllFields} formID={this.state.chosenForm} url={"http://localhost/curl/Discord/index.php?type=fields"} type={"fields"} handler={this.handleChange} handlerAll={this.handleChangeAll} />
        if (this.state.showErrorMessage == 1) {
            errorMessage = 'You need to pick at least one channel and one submission to submit'
        } else if (this.state.showErrorMessage == 2) {
            errorMessage = "You need to pick at least one channel or user to submit"
        } else {
            errorMessage = "You need to pick at least one submission to submit"
        }

        if (!this.state.auth && !this.state.loading) {
            body = <Authentication handler={this.handleButtonAuthorize} />
        } else if (this.state.auth && this.state.loading) {
            body = <Spinner animation="border" />
        } else if (this.state.auth && !this.state.loading) {
            body = <Container fluid>
                <Row>
                    <Col md={{ span: 3 }} justify="center">
                        {this.state.formPicked ? <Button style={{
                            marginTop: "10px",
                            marginBottom: "10px",
                        }} onClick={this.handleButtonSelect}>Choose another form</Button> : ""} <div><FetchSelect formPicked={this.state.formPicked} ref={this.formRef} url={"http://localhost/curl/Discord/index.php?type=forms"} handler={this.handleSelect} /> </div>
                        {!this.state.formPicked ? "" : channels}

                        {!this.state.formPicked ? "" : fields}

                        {this.state.formPicked ? <div> <Button size="lg" onClick={this.handleButtonSubmit}>Submit</Button><div style={!this.state.error ? {
                            transition: "opacity 1s ease-in-out", opacity: 0, fontWeight: "500", color: "red"
                        } : {
                                transition: "opacity 100ms ease-in-out", opacity: 1, fontWeight: "500", color: "red"
                            }}>
                            {errorMessage}</div></div> : ""}

                    </Col>
                    <Col md={{ span: 3 }} >
                        {!this.state.formPicked ? "" : <div style={{ marginTop: "56px" }}>{submissions}<div style={{
                            borderColor: "#cc8b00",
                            borderWidth: "thin",
                            overflow: "auto",
                            overflowX: "hidden",
                            textAlign: "justify",
                            marginBottom: "20px",
                        }}><Form.Label>Notes and Comments</Form.Label><textarea style={{
                            borderColor: "#cc8b00", backgroundColor: "#fff7e6", width: "450px",
                            minWidth: "450px",
                            maxWidth: "450px",
                            height: "210px",
                            minHeight: "210px",
                            maxHeight: "210px", borderColor: "#cc8b00",
                            borderWidth: "thin",
                            boxShadow: "0"
                        }} value={this.state.notes} rows="5" onChange={this.handleText} /></div>
                        </div>}

                    </Col>
                    <Col md={{ span: 6 }} justify={"right"}>
                        <div style={{ marginTop: "10px" }} >
                            <Tabs activeKey={this.state.focus} onSelect={(k) => this.setState(()=>{
                                return{
                                    focus:k
                                }
                            })} >
                                <Tab eventKey="history" title="Previous Submissions" >
                                    <History handler={this.handleHistory} submitted={this.state.submitted} user_id={this.state.user.id} />
                                </Tab>
                                <Tab eventKey="preview" title="Preview">
                                    <AppEmbed embedData={this.state.previewData} />
                                </Tab>
                            </Tabs>
                        </div>
                    </Col>
                </Row>
            </Container >
        }


        return (
            <div style={{
                width: "100vw",
                minHeight: "100vh",
                backgroundColor: "#fff7e6"
            }
            }>
                <div className="">
                    <Header loading={this.state.loading} auth={this.state.auth} user={this.state.user} />
                </div>
                <div>
                    {body}
                </div>
            </div >
        )
    }
}

export default App