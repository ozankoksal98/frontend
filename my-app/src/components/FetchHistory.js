import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Spinner from "react-bootstrap/Spinner"
import { Container, Row, Col } from "react-bootstrap"

class FetchHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: null,
            props: null,
            submitted: this.props.submitted
        };
    }

    async componentDidMount() {
        const response = await fetch("http://localhost/curl/Discord/index.php?type=history&user_id=" + this.props.user_id, {
            method: 'GET',
            redirect: 'follow'
        })
        const data = await response.json()
        const str = JSON.stringify(data)
        const arr = JSON.parse(str)
        if (str != "") {
            this.setState(() => {
                return {
                    data: arr,
                    loading: false
                }
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.submitted != this.props.submitted) {
            console.log("change")
            var str
            fetch("http://localhost/curl/Discord/index.php?type=history&user_id=" + this.props.user_id, {
                method: 'GET',
                redirect: 'follow'
            }).then(response => response.json())
                .then(str => JSON.stringify(str))
                .then(result => {
                    console.log(result)
                    if (result != "") {
                        this.setState(() => {
                            return {
                                submitted: true,
                                data: JSON.parse(result),
                                loading: false
                            }
                        })
                    }
                })
        }
    }

    createChild() {
        if (!this.state.loading) {
            var cards = this.state.data.map(i => {
                var channel_ids = []
                var user_ids = []
                var field_ids = []
                var submission_ids = []
                var channels = []
                var fields = []
                var submissions = []
                var users = []

                i.channels.forEach(j => {
                    channels.push(<li>{(j.title)}</li>)
                    channel_ids.push(j.id)
                });
                i.users.forEach(j => {
                    users.push(<li>{(j.title)}</li>)
                    user_ids.push(j.id)
                });
                i.fields.forEach(j => {
                    fields.push(<li>{(j.title)}</li>)
                    field_ids.push(j.id)
                });
                i.submissions.forEach(j => {
                    submissions.push(<li>{j.title.replace("Submission by : ", "")}</li>)
                    submission_ids.push(j.id)
                });

                return (
                    <div>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="outline" eventKey={i.id}>
                                    {i.form_id[0].title + " submitted at " + i.created_at}
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={i.id}>
                                <Card.Body>
                                    <Container>
                                        <Row>
                                            <Col md={{ span: 3 }}>{channels.length != 0 ? <ul><h5>Channels</h5>
                                                {channels}
                                            </ul> : ""}

                                                {users.length != 0 ? <ul><h5>Users</h5>
                                                    {users}
                                                </ul> : ""}
                                            </Col>
                                            <Col md={{ span: 3 }}>
                                                {fields.length == 0 ? <div><h5>Fields</h5>None</div> : <ul>
                                                    <h5>Fields</h5>{fields}</ul>}
                                            </Col>
                                            <Col md={{ span: 5 }}>
                                                <ul>
                                                    <h5>Submissions</h5>
                                                    {submissions}
                                                </ul>
                                            </Col>
                                            <Col md={{ span: 1 }}>
                                                <Button onClick={() => this.props.handler(i.form_id[0].id, channel_ids, user_ids, field_ids, submission_ids,i.notes)}>Edit</Button>
                                                <Button>Re-Submit</Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                            {i.notes ==null ? "":<div> <h5>
                                                    Notes and Comments
                                            </h5><br></br>
                                                {i.notes}</div>}
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </div>)
            });
            return (<div >
                <Accordion defaultActiveKey="0">
                    {cards}
                </Accordion>
            </div>)
        }
    }

    render() {
        var child = this.createChild()
        return (
            <div>
                {!this.state.loading && this.props.auth ? <Spinner /> : child}
            </div>

        );
    }
}

export default FetchHistory;