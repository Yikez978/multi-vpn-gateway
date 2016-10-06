
import { Clients } from '../api/clients.js';
import { Tuns } from '../api/tuns.js';

import './client.html';

Template.client.helpers({
  tuns() {
  	let cls = Tuns.find({});
  	// console.log("Tuns:" + cls.count());
    return cls;
  },

  materializeSelect() {
    Meteor.setTimeout(() => {
      $('select').material_select();
      console.log("reinitialized select!");
    }, 20);
  }
});

Template.client.rendered = function() {
	$('select').material_select();
}




Template.client.events({
  'change select'(event) {
    // Get the selected tunnel device
    let value = $("option:selected", event.target).val();
    // console.log("Select changed to: "+value);

    Clients.update(this._id, {
      $set: { tunId: value }
    });

  }
});
