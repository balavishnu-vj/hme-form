import React from 'react';
import TextField from '../../components/TextField';
import DropDown from '../../components/DropDown';


const formConfig = [
    {
        label: 'Name',
        id: 'name',
        required: true,
        pattern: /^([a-zA-Z0-9]){3,13}$/,
        fieldType: 'text',
    },
    {
        label: 'Age',
        id: 'age',
        required: true,
        fieldType: 'number',
        minValue: 1,
        maxValue: 100,
        maxLength: 3,
    },
    {
        label: 'Phone',
        id: 'phone',
        required: true,
        fieldType: 'number',
        pattern: /^([0-9]){10}$/,
    },
];

class FirstForm extends React.Component {
    constructor(props){
        super(props);
        const initialForm = ['name', 'age'];
        const formState = {};
        formConfig.forEach((formField) => {
            formState[formField.id] = {
                value: '',
                error: '',
            }
        })
        this.state = {
            ...formState,
            initialForm,
            categoryDropDown: [],
        };
    }

    componentDidMount = () => {
        fetch('http://www.mocky.io/v2/5b6555f53300001000f6a9d3')
        .then((response) =>response.json())
        .then((parsedJSON) => {
            console.log('parsedJSON: ', parsedJSON);
            this.setState({ categoryDropDown: parsedJSON.categories })
        })
    }
    preventDefault = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }
    onChange = (value, fieldId) => {
        this.setState((state) => {
            const newValue = {
                value,
                error: '',
            };
            const newState = {...state};
            newState[fieldId] = newValue;
            return newState;
        });
        if (fieldId === 'age') {
          let val = parseInt(value, 10);
          if (val < 18) {
              this.setState(({initialForm}) => {
                  if (initialForm.includes('phone')) {
                      return {initialForm};
                  }
                  const newForm = [...initialForm, 'phone'];
                  return {initialForm: newForm}
              })
          } else {
            this.setState(({initialForm}) => {
                if (!initialForm.includes('phone')) {
                    return {initialForm};
                }
                    const index = initialForm.indexOf('phone');
                    if (index > -1) {
                        initialForm.splice(index, 1);
                    }
                    // array = [2, 9]
                const newForm = [...initialForm];
                return {initialForm: newForm}
            })
          }   
        }
    }

    validateField = (formField) => {
        const fieldId = formField.id;
        const fieldState = this.state[fieldId];
        let value =  fieldState.value;
        if (formField.pattern) {
            return formField.pattern.test(value);
        }
        if (formField.minValue && formField.maxValue) {
            value = parseInt(value, 10);
            return (value > formField.minValue && value < formField.maxValue)
        }
        return true
    }
    submitForm = () => {
        let isFormValid = true;
        this.state.initialForm.forEach((formField) => {
            const fieldId = formField.id;
            const fieldState = this.state[fieldId];
            const isFieldValid = this.validateField(formField);
            isFormValid = isFormValid && isFieldValid;
            if (!isFieldValid) {
                this.setState((state) => {
                    const newValue = {
                        value: fieldState.value,
                        error: 'Not valid',
                    };
                    const newState = {...state};
                    newState[fieldId] = newValue;
                    return newState;
                })
            }
        });

        if (isFormValid) {
            console.log('isFormValid: ', isFormValid);
        }
    }
    render(){
        const { name } = this.state;
        const formsList = this.state.initialForm.map((fieldId) => {
            const formObj = formConfig.find((obj) => obj.id === fieldId);
            return formObj;
        })
        const textFields = formsList.map((formField) => {
            const fieldId = formField.id;
            const fieldState = this.state[fieldId];
            console.log('fieldState: ', fieldState);
            return (
                <TextField
                    key={fieldId}
                    label={formField.label}
                    id={fieldId}
                    onChange={this.onChange}
                    value={fieldState.value}
                    error={fieldState.error}
                    maxLength={formField.maxLength}
                    type={formField.fieldType}
                />
            );
        })
        console.log('name: ', name);
        return (
            <form onSubmit={this.preventDefault}>
            {textFields}
            <DropDown
                id={'categoryDropDown'}
                onChange={this.onChange}
                options={this.state.categoryDropDown}
                selectedId={1}
            />
                <button type="submit" onClick={this.submitForm} >Submit </button>
            </form>
        );
    }
}

export default FirstForm;