import React from 'react';

class DropDown extends React.Component {
    handleChange = (event) => {
        console.log('event: ', event, event.nativeEvent.selectedIndex);
    }
    render(){
        const options = this.props.options.map((option) => {
            return(<option
                key={option.id}
                value={option.id}
                onChange={() => this.props.onChange(option.value, this.props.id)}
                >{option.value}</option>)

        })
        return (
            <select value={this.props.selectedId} onChange={() => {}}>
                {options}
            </select>
        );
    }
}

export default DropDown;