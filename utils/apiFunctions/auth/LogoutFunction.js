export function logoutUser() {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
}
