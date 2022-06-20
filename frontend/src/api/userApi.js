import { deleteJson, getJson, postJson, putJson } from "./index";

export function createUser(params) {
  return postJson('/users/invite', params);
}

export function createUsers(params) {
  // TODO: implement backend?
  return postJson('/users/', {csv: params});
}


export function updateUser(id, params) {
  return putJson('/user/' + id + '/', params);
}

export function fetchUser(id) {
  return getJson('/user/' + id + '/');
}

export function fetchUsers() {
  return getJson('/users/');
}

export function deleteUser(id, params, callback) {
  const response = deleteJson('/user/' + id + '/');
  if (response.status !== 204)
    throw Error('Server does not return correct code.');
}
