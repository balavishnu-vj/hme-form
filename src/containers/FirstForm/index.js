/*
  TODO: Have reactive form validations
*/

import React from 'react';
import { connect } from 'react-redux'
import { updateFirstForm } from '../../actions';
import TextField from '../../components/TextField';
import DropDown from '../../components/DropDown';
import DatePicker from '../../components/DatePicker';
import { getCategoryList } from '../../apiService';
import { THIS_DAY } from '../../helper';


const formConfig = {
    name: {
        label: 'Name',
        required: true,
        pattern: /^([a-zA-Z0-9]){3,13}$/,
        fieldType: 'text',
    },
    age: {
        label: 'Age',
        required: true,
        fieldType: 'number',
        minValue: 1,
        maxValue: 100,
        maxLength: 3,
    },
    phone: {
        label: 'Phone',
        required: true,
        fieldType: 'number',
        pattern: /^([0-9]){10}$/,
    },
};

class FirstForm extends React.Component {
    constructor(props){
        super(props);
        const textfieldsToShow = ['name', 'age'];
        const formState = {};
        const { formData }  =this.props.appReducer;
        Object.keys(formConfig).forEach((formField) => {
            formState[formField] = {
                value: formData[formField] || '',
                error: '',
            }
        })
        this.state = {
            ...formState,
            textfieldsToShow,
            categoryIndex: 0,
            productIndex: 0,
            instanceDate: formData.instanceDate,
            instanceDateError: '',
            categoryDropDown: [],
        };
    }

    componentDidMount = () => {
        getCategoryList().then((categoryData) => {
            const { categories, products } = categoryData;
            const productsObj = {};
            products.forEach((product) => {
                const {categoryId} = product
                if (productsObj[categoryId]) {
                    productsObj[categoryId].push(product);
                } else {
                    productsObj[categoryId] = [product]
                }
            });
            const formattedCategories = categories.map((category) => {
                const formattedCategory = {...category, products: productsObj[category.id]};
                return formattedCategory;
            });
            const { formData }  =this.props.appReducer;
            const selectedCategoryIndex = formattedCategories.findIndex((category) => category.id === formData.selectedCategoryId);
            const selectedProductIndex = formattedCategories[selectedCategoryIndex] && formattedCategories[selectedCategoryIndex].products.findIndex((product) => product.id === formData.selectedProductId);
            const categoryIndex = selectedCategoryIndex === -1 ? 0 : selectedCategoryIndex;
            this.setState({categoryDropDown: formattedCategories, categoryIndex, productIndex:  selectedProductIndex || 0})
        });
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
              this.setState(({textfieldsToShow}) => {
                  if (textfieldsToShow.includes('phone')) {
                      return {textfieldsToShow};
                  }
                  const newForm = [...textfieldsToShow, 'phone'];
                  return {textfieldsToShow: newForm}
              })
          } else {
            this.setState(({textfieldsToShow}) => {
                if (!textfieldsToShow.includes('phone')) {
                    return {textfieldsToShow};
                }
                    const index = textfieldsToShow.indexOf('phone');
                    if (index > -1) {
                        textfieldsToShow.splice(index, 1);
                    }
                    // array = [2, 9]
                const newForm = [...textfieldsToShow];
                return {textfieldsToShow: newForm}
            })
          }   
        }
    }

    onDropDownChange = (selectedIndex, fieldId) => {
        this.setState((state) => {
            const newState = {...state};
            newState[fieldId] = selectedIndex;
            if (fieldId === 'categoryIndex') {
                newState.productIndex = 0;
            }
            return newState;
        })
    }

    validateField = (formField, fieldId) => {
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

    validateDate = (fieldId, value) => {
        if (fieldId === 'instanceDate') {
            const thisDayTime = THIS_DAY.getTime();
            const instanceDateTime = value.getTime();
            return instanceDateTime <= thisDayTime;
        }
        return true
    }
    submitForm = () => {
        const isInstanceDateValid = this.validateDate('instanceDate', this.state.instanceDate);
        let isFormValid = isInstanceDateValid;
        this.state.textfieldsToShow.forEach((fieldId) => {
            const formField = formConfig[fieldId]
            const fieldState = this.state[fieldId];
            const isFieldValid = this.validateField(formField, fieldId);
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
        if (!isInstanceDateValid) {
            this.setState({ instanceDateError: 'Should be not be a future date' });
        }
        if (isFormValid) {
            const formData = this.getFormData();
            this.props.updateFirstForm(formData);
            this.props.history.push('/second-form/')
        }
    }

    getFormData = () => {
        const formData = {};
        const { textfieldsToShow, categoryDropDown, categoryIndex, productIndex } = this.state;
        textfieldsToShow.forEach((fieldId) => {
            const fieldState = this.state[fieldId];
            formData[fieldId] = fieldState.value;
        });
        formData.selectedCategoryId = categoryDropDown[categoryIndex].id
        formData.selectedProductId = categoryDropDown[categoryIndex].products[productIndex].id
        return formData;
    }
    onDateChange = (date) => {
        this.setState({ instanceDate: date, instanceDateError: '' });
    }
    render(){
        const { textfieldsToShow, categoryDropDown, categoryIndex, productIndex } = this.state;
        const productsOption = categoryDropDown[categoryIndex] && categoryDropDown[categoryIndex].products;
        const textFields = textfieldsToShow.map((fieldId) => {
            const formField = formConfig[fieldId];
            const fieldState = this.state[fieldId];
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
        return (
            <form onSubmit={this.preventDefault}>
            <h1>First Form</h1>
            {textFields}
            <div className="dropdown-wrap">
                <label>Select Category</label>
                <DropDown
                    id={'categoryIndex'}
                    onChange={this.onDropDownChange}
                    options={categoryDropDown}
                    selectedIndex={categoryIndex}
                    
                />
            </div>
            {
                productsOption
                ? 
                <div className="dropdown-wrap">
                    <label>Select Product</label>
                    <DropDown
                        id={'productIndex'}
                        onChange={this.onDropDownChange}
                        options={productsOption}
                        selectedIndex={productIndex}
                    />
                </div>
                :  null
            }
            <DatePicker
                onDateChange={this.onDateChange}
                value={this.state.instanceDate}
                label={'Instance Date'}
                error={this.state.instanceDateError}
            />
                <button type="submit" onClick={this.submitForm} >Submit </button>
            </form>
        );
    }
}



const mapStateToProps = state => ({
    appReducer: state.appReducer,
  })
  
  const mapDispatchToProps = dispatch => ({
    updateFirstForm: (id) => dispatch(updateFirstForm(id))
  })
  
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(FirstForm)
  