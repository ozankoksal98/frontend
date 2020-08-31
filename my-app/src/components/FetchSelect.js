import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'


class FetchSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            options:null
        };
        this.url = this.props.url
    }

    async componentDidMount(){
        const response = await fetch(this.url, {
            method: 'GET',
            redirect: 'follow'
        })
        var data = await response.json()
        var str = JSON.stringify(data)
        var json = JSON.parse(str)
        var comp = []
        var op =[]
        var parsedData = []
        json.forEach(i => {op.push(<option value = {i["id"]}>
                {i["title"]}
            </option>)
            parsedData.push(i)
        });
        comp.push(<Form>
            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Control style={{marginTop:"10px",marginBottom:"10px"}} as="select" onChange= {this.props.handler} custom>
              <option value="" disabled selected hidden>Choose a Form...</option>
            {op}
            </Form.Control>
  </Form.Group>
</Form>)
        

        this.setState({
            parsedData:parsedData,
            options:comp,
            loading:false
        })
    }

    render() {
        var ret
        if(this.state.loading && !this.props.formPicked){
            ret = "Getting forms"
        }else if(!this.state.loading && !this.props.formPicked){
            ret =this.state.options
        }else{
            ret = ""
        }

        return (
            <div>
                {ret}
                
            </div>
        );
    }
}

export default FetchSelect;