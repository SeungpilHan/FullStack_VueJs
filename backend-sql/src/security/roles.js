/**
 * List of Roles available for the Users.
 */
class Roles {
  static get values() {
    return {
      owner: 'owner',
      editor: 'editor',
      viewer: 'viewer',
      auditLogViewer: 'auditLogViewer',
      iamSecurityReviewer: 'iamSecurityReviewer',
      entityEditor: 'entityEditor',
      entityViewer: 'entityViewer',
      bookEditor: 'bookEditor',
      bookViewer: 'bookViewer',
      loanEditor: 'loanEditor',
      loanViewer: 'loanViewer',
    };
  }
}

module.exports = Roles;
