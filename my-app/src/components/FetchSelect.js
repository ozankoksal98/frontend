import React, { Component } from 'react';

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
        const data = await response.json()
        const str = JSON.stringify(data)
        const json = JSON.parse(str)
        const comp = []
        const op =[]
        json.forEach(i => {op.push(<option value = {i["id"]}>
                {i["title"]}
            </option>)
            
        });
        comp.push(<select onChange= {this.props.handler}>
            <option value="" disabled selected hidden>Choose a Form...</option>
            {op}
        </select>)
        

        this.setState({
            options:comp,
            loading:false
        })
    }

    render() {
        return (
            <div>
                {this.state.loading ? "Getting forms" :this.state.options}
            </div>
        );
    }
}

export default FetchSelect;