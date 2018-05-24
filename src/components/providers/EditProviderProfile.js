import React, { Component } from 'react'
import _ from 'lodash'

// components
import ProvidersIndex from './ProvidersIndex.js'
import ProviderRow from './ProviderRow.js'
import ProviderForm from './ProviderForm.js'

// styles
import { Table, Button, Row, Glyphicon, Form, FormGroup, Col, ControlLabel, FormControl} from 'react-bootstrap'
import { fetchProvider } from '../../store/ProviderActions.js'
import { connect } from 'react-redux'
import { updateProvider } from '../../store/actions.js'

import { Link } from 'react-router-dom';

class EditIndividualProvider extends Component {
    constructor(props) {
	  super(props);

	  this.formValChange = this.formValChange.bind(this);
	  this.submit = this.submit.bind(this);
	  this.state= { id: this.props.match.params.id, form : {
	    	provider_type: 'Individual',
	        id: '',
	        first_name: '',
	        last_name: '',
	        gender: '',
	        email: '',
	        phone: '',
	        phone_extension: '',
	        referrer: '',
	        location: 'Canada',
	        visibility: 'select'
	        }
        } 
    }

	componentWillMount() { 
	  const id = this.props.match.params.id
	  this.props.dispatch(fetchProvider(id));
	}

    formValChange(e) {
      let next = {...this.state.form, [e.target.id] : e.target.value};
      this.setState({ form : next });
    }

    submit(e) {
      //this.props.action(form);
      e.preventDefault();
      this.props.dispatch(updateProvider(this.state.form));
      this.props.history.push('/providers/');
    }

	render() {
		const id = this.props.match.params.id;
        const provider = this.props.providersById[id];
		
		const isEnabled = 
        this.state.form.phone.length > 0 &&
        this.state.form.email.length > 0 &&
        this.state.form.first_name.length > 0 &&
        this.state.form.last_name.length > 0 && 
        this.state.form.location.length > 0 &&
        this.state.form.visibility !== 'select';

		return (
	      <Row className="content">
	        <Col sm={12}>
	          <h3>Edit Provider Profile</h3>
	          <hr/>
	        </Col>

          { provider && provider.loaded &&
          	<div>
			  <Form horizontal>

            <FormGroup controlId="first_name">
              <Col componentClass={ControlLabel} sm={3}>
                First name (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text"
                  placeholder="Aravind" defaultValue={provider.first_name} onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="last_name">
              <Col componentClass={ControlLabel} sm={3}>
                Last name (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue={provider.last_name}
                  placeholder="Adiga" onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="preferred_name">
              <Col componentClass={ControlLabel} sm={3}>
                Preferred Name
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue= {provider.preferred_name} onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Email
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue=""
                  placeholder="aravind.adiga.gmail.com" defaultValue={provider.email} onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="phone">
              <Col componentClass={ControlLabel} sm={3}>
                Phone Number (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue={provider.phone} onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="extension">
              <Col componentClass={ControlLabel} sm={3}>
                Extension
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue={provider.extension} onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId= "location">
              <Col componentClass={ControlLabel} sm={3}>
                Address
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue={this.state.location} onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="referrer">
              <Col componentClass={ControlLabel} sm={3}>
                Referrer
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue={provider.referrer} onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="visibility">
              <Col componentClass={ControlLabel} sm={3}>
                Allow other agencies to see this provider?
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select" onChange={this.formValChange}>
                  <option value="select">-- Not Set --</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={3} sm={9}>
              {/*<Link to={`/providers/new/add-service`}> */}
                <Button disabled = {!isEnabled} type="submit" onClick={this.submit}>
                  Submit
                </Button>
               {/*</Link>*/}
              </Col>
            </FormGroup>
            </Form>
        </div>
       }
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    providersById: state.providers.byId || {},
    providerLoaded: state.providers.indexLoaded
  } 
}

export default connect(
  mapStateToProps  
)(EditIndividualProvider);