import { Template } from 'meteor/templating';
import { Tuns } from '../api/tuns.js';
import { VpnConfigs } from '../api/vpnconfigs.js';

import './tun.js';
import './tun-select-body.html';


Template.tunnels.helpers({
  tuns() {
    return Tuns.find({});
  },

});

Template.tun.helpers({

  destinations() {
  	console.log("destinations");
  	console.log("Number of vpnconfigs: " + VpnConfigs.find({}).count());



    return VpnConfigs.find({});
  },

  materializeSelect() {
    Meteor.setTimeout(() => {
      $('select').material_select();
      console.log("reinitialized select!");
    }, 20);
  }

});


Template.tun.rendered = function() {
	$('select').material_select();

}

Template.tun.events({
  'change select'(event) {
    let value = $("option:selected", event.target).val();
    // console.log("Select changed to: "+value);

    let vpnconfig = VpnConfigs.findOne({vpnconfig: value});

    Tuns.update(this._id, {
      $set: { vpnconfig: value, destination: vpnconfig.destination }
    });

  }
});


