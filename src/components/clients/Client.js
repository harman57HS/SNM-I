import React, { Component } from 'react';
import _ from 'lodash';

import ClientNeeds from '../ClientNeeds';

// redux
import { connect } from 'react-redux'
import { fetchClient } from '../../store/actions/clientActions.js'

import { formatLocation } from '../../helpers/location_helpers'

import { Table, Label, Glyphicon, Button } from 'react-bootstrap';

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
      <div className="content client">
        <h3>Client Profile</h3>
        <Button bsStyle="primary" onClick={() => window.print()} className="print-button">
          <Glyphicon glyph="print" />
        </Button>
        { client && client.loaded &&
          <div>
            { client.is_deleted &&
              <h4>
                <Label bsStyle="danger">deleted</Label>
              </h4>
            }
            <Table bordered condensed className="client-profile-table">
              <tbody>
                <tr>
                  <td colSpan="2"><b>Personal Information: </b></td>
                </tr>
                <tr>
                  <td ><b>First Name</b></td>
                  <td>{client.first_name}</td>
                </tr>
                <tr>
                  <td><b>Middle Name</b></td>
                  <td>{client.middle_name}</td>
                </tr>
                <tr>
                  <td><b>Last Name</b></td>
                  <td>{client.last_name}</td>
                </tr>
                <tr>
                  <td><b>Preferred Name</b></td>
                  <td>{client.preferred_name}</td>
                </tr>
                <tr>
                  <td><b>Gender</b></td>
                  <td>{client.gender}</td>
                </tr>
                <tr>
                  <td><b>Date of Birth</b></td>
                  <td>{client.birth_date}</td>
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
            <Table bordered condensed className="client-profile-table">
              <tbody>
                <tr>
                  <td colSpan="2"><b>Family: </b></td>
                </tr>
                {client.family && client.family.file_id &&
                  (<tr>
                    <td><b>File ID</b></td>
                    <td>{client.family.file_id}</td>
                  </tr>)
                }
                <tr>
                  <td><b>Marital Status</b></td>
                  <td>{client.marital_status}</td>
                </tr>
                <tr>
                  <td><b>Has children?</b></td>
                  <td>{client.has_children ? 'Yes' : 'No'}</td>
                </tr>
              </tbody>
            </Table>
            {(client.spouse || client.children) &&
              <Table bordered condensed className="client-profile-table">
                <tbody>
                  <tr>
                    <td colSpan="4"><b>Family Members: </b></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Full name</td>
                    <td>Date of birth</td>
                    <td>Gender</td>
                  </tr>
                  {client.spouse &&
                    (<tr>
                      <td><b>Spouse</b></td>
                      <td>{client.spouse.full_name}</td>
                      <td>{client.spouse.birth_date}</td>
                      <td>{client.spouse.gender}</td>
                    </tr>)
                  }
                  {_.map(client.children, (child, index) => {
                    return (
                      <tr key={child.id}>
                        <td><b>Children #{index+1}</b></td>
                        <td>{child.full_name}</td>
                        <td>{child.birth_date}</td>
                        <td>{child.gender}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            }
            <Table bordered condensed className="client-profile-table">
              <tbody>
                <tr>
                  <td colSpan="2"><b>Country of Origin Information: </b></td>
                </tr>
                <tr>
                  <td><b>Country of Origin</b></td>
                  <td>{client.country_of_origin}</td>
                </tr>
                <tr>
                  <td><b>Country of Last Residence</b></td>
                  <td>{client.country_of_last_residence}</td>
                </tr>
                <tr>
                  <td><b>First Language</b></td>
                  <td>{client.first_language}</td>
                </tr>
                <tr>
                  <td><b>Other Language(s) spoken</b></td>
                  <td>{client.other_languages}</td>
                </tr>
                <tr>
                  <td><b>Permanent Residence Card Number (PR card)</b></td>
                  <td>{client.pr_number}</td>
                </tr>
                <tr>
                  <td><b>Immigration Document Number</b></td>
                  <td>{client.immigration_doc_number}</td>
                </tr>
                <tr>
                  <td><b>Landing Date</b></td>
                  <td>{client.landing_date}</td>
                </tr>
                <tr>
                  <td><b>Arrival Date</b></td>
                  <td>{client.arrival_date}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        }
        <hr />
        { client && client.loaded && p.needsLoaded &&
          <ClientNeeds clientId={client.id} needs={p.needsById} needsOrder={p.needsOrder} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    needsById: state.needs.byId,
    needsOrder: state.needs.order,
    needsLoaded: state.needs.loaded,
    clientsById: state.clients.byId,
    clientLoaded: state.clients.indexLoaded
  }
}

export default connect(
  mapStateToProps
)(Client);
