import React, { Component } from 'react';
import { Container, Row, Col } from "react-bootstrap"
import Image from "react-bootstrap/Image"
import Media from "react-bootstrap/Media"

class Authentication extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <Container fluid>
                    <Row style={{
                        marginTop: "30px",
                        marginBottom: "30px"
                    }}>
                        <Col md={{ span: 11, offset: 1 }}>
                            <Media >
                                <img
                                    width={80}
                                    height={80}
                                    className="mr-3"
                                    src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/91_Discord_logo_logos-512.png"
                                    alt="Generic placeholder"
                                />
                                <Media.Body>
                                    <h3>Discord</h3>
                                Sync your form submissions to your Discord channels or members.
                        </Media.Body>
                            </Media>
                        </Col>
                    </Row>
                    <Row style={{
                        marginTop: "30px",
                        marginBottom: "30px"
                    }}>
                        <Col md={{ span: 5, offset: 1 }}>
                            You can use this tool to:
                                <ul>
                                <li>Send submissions to your Discord channels</li>
                                <li>Send submissions to Discord server members</li>
                            </ul>
                        </Col>
                    </Row>
                    <Row style={{
                        marginTop: "30px",
                        marginBottom: "30px"
                    }}>
                        <Col md={{ span: 3, offset: 1 }}>
                            <h4>Authentication</h4>
                            Authenticate your Discord account in order to send form submissions to Discord channels or members in your Discord server.
                        </Col>
                        <Col md={{ span: 3 }}>
                            
                                <button type="button" onClick={this.props.handler} style={{
                                    backgroundImage: "url(https://i.imgur.com/RBfcoBt.png)", backgroundSize: "contain", height: "40px", border: "none",
                                    width: "190px",
                                    marginTop: "30px",
                                    marginBottom: "30px"

                                }} />
                        
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Authentication;