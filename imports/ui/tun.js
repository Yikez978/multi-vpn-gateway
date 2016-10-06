import { Template } from 'meteor/templating';
import { Tuns } from '../api/tuns.js';

import './tun.html';

Template.tun.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Tuns.update(this._id, {
      $set: { enabled: ! this.enabled }
    });

  },
  'click .delete'() {
    Tuns.remove(this._id);
  },
});