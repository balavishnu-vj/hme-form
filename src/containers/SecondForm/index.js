/*
  TODO: Have reactive form validations
*/

import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { updateFirstForm, resetForm } from '../../actions';
import { getCategoryList } from '../../apiService';
import DatePicker from '../../components/DatePicker';
import { THIS_DAY } from '../../helper';



class SecondFrom extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            categoryDropDown: [],
            issueDateError: '',
        }
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
            this.setState({categoryDropDown: formattedCategories })
        });
    }

    preventDefault = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    getSelectedCategory = () => {
        const selectedCategory = this.state.categoryDropDown.find((category) => category.id === this.props.appReducer.formData.selectedCategoryId);
        return selectedCategory && selectedCategory.value;
    }

    validateDate = () => {
        const { issueDate, instanceDate } = this.props.appReducer.formData
            const thisDayTime = THIS_DAY.getTime();
            const instanceDateTime = instanceDate.getTime();
            const issueDateTime = issueDate.getTime();
            return (issueDateTime <= thisDayTime) && (issueDateTime <= instanceDateTime);
    }

    onDateChange = (date) => {
        this.props.updateFirstForm({ issueDate: date });
        this.setState({ issueDateError: '' });
    }

    submitForm = () => {
        const isFormValid = this.validateDate();
        if (isFormValid) {
            alert('Form has been submitted. Will be redirected to First Form')
            this.props.resetForm();
            this.props.history.push('/');
        } else {
            this.setState({ issueDateError: 'Should not be a future date and it should less than instance date' });
        }
    }
    render(){
        const selectedCategory = this.getSelectedCategory();
        return (<form onSubmit={this.preventDefault}>
                    <h1>Second Form</h1>
            <div>
                <span>Selected Product: </span>
                <span>{selectedCategory}</span>
            </div>
            <DatePicker
                onDateChange={this.onDateChange}
                value={this.props.appReducer.formData.issueDate}
                label={'Issue Date'}
                error={this.state.issueDateError}
            />
            <Link to="/">Change Product or Category</Link>
            <div>
                <button type="submit" onClick={this.submitForm} >Submit </button>
            </div>
        </form>)
    }
}



const mapStateToProps = state => ({
    appReducer: state.appReducer,
  })
  
  const mapDispatchToProps = dispatch => ({
    updateFirstForm: (data) => dispatch(updateFirstForm(data)),
    resetForm: () => dispatch(resetForm())
  })
  
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(SecondFrom)