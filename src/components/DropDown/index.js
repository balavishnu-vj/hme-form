import React from 'react';

class DropDown extends React.Component {
    handleChange = (event) => {
        const { value } = event.target;
        const selectIndex = this.props.options.findIndex((option) => option.id === parseInt(value, 10));
        this.props.onChange(selectIndex, this.props.id)
    }
    render(){
        const selectedOption  = this.props.options[this.props.selectedIndex];
        const selectedId = selectedOption && selectedOption.id;
        const options = this.props.options.map((option) => {
            return(<option
                key={option.id}
                value={option.id}
                >{option.value}</option>)

        })
        return (
            <select value={selectedId} onChange={this.handleChange} className="dropdown">
                {options}
            </select>
        );
    }
}

export default DropDown;