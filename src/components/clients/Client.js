import React, { Component } from 'react';

import ClientNeeds from '../ClientNeeds';

// redux
import { connect } from 'react-redux'
import { fetchClient } from '../../store/actions/clientActions.js'

import { formatLocation } from '../../helpers/location_helpers'

import { Table } from 'react-bootstrap';

class Client extends Component {
  componentWillMount() {
    const id = this.props.match.params.id
    this.props.dispatch(fetchClient(id));
  }

  render() {
    const p = this.props,
          id = p.match.params.id,
          client = p.clientsById[id];

    return (
      <div className="content">
        <h3>Client Profile</h3>
        { client && client.loaded &&
          <Table striped bordered condensed hover>
            <tbody>
              <tr>
                <td><b>First Name</b></td>
                <td>{client.first_name}</td>
              </tr>
              <tr>
                <td><b>Last Name</b></td>
                <td>{client.last_name}</td>
              </tr>
              <tr>
                <td><b>Gender</b></td>
                <td>{client.gender === 0 ? 'Female' : 'Male'}</td>
              </tr>
              <tr>
                <td><b>Preferred Name</b></td>
                <td>{client.preferred_name}</td>
              </tr>
              <tr>
                <td><b>Date of Birth</b></td>
                <td>{client.birth_date}</td>
              </tr>
              <tr>
                <td><b>Marital Status</b></td>
                <td>Single</td>
              </tr>
              <tr>
                <td><b>Email</b></td>
                <td>{client.email}</td>
              </tr>
              <tr>
                <td><b>Phone Number</b></td>
                <td>{client.primary_phone_number}</td>
              </tr>
              <tr>
                <td><b>Alternative Phone Number</b></td>
                <td>{client.alt_phone_number}</td>
              </tr>
              <tr>
                <td><b>Address</b></td>
                <td>{formatLocation(client.address)}</td>
              </tr>
            </tbody>
          </Table>
        }
        <hr />
        { p.needsLoaded &&
          <ClientNeeds clientId={client.id} needs={p.needsById} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    needsById: state.needs.byId,
    needsLoaded: state.needs.loaded,
    clientsById: state.clients.byId,
    clientLoaded: state.clients.indexLoaded 
  }  
}

export default connect(
  mapStateToProps
)(Client);
