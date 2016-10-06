import { Template } from 'meteor/templating';
import { Tuns } from '../api/tuns.js';
import { Clients } from '../api/clients.js';

import './client.js';
import './tunoption.html';

import './client-list.html';


Template.clients.helpers({
  clients() {
  	let cls = Clients.find({active: true});
  	console.log(cls.count());
    return cls;
  },

  tuns() {
  	let cls = Tuns.find({});
  	console.log("Tuns:" + cls.count());
    return cls;
  },
});