// import '../imports/ui/client-list.js';

// TODO Define this somewhere globally
Template.registerHelper('isSelected', function(expected, actual) {
	let out = expected == actual ? 'selected' : '';
	// console.log("Selected: " + out)
    return out;
});


import '../imports/ui/body.html';
import '../imports/ui/tun-select.js';
import '../imports/ui/client-list.js';


FlowRouter.route('/', {
    name: 'index',
    action: function(params) {
        console.log("Displaying index");
        BlazeLayout.render("bodyTemplate");

    }
});


FlowRouter.route('/tunnels', {
    name: 'tunnels',
    action: function(params) {
        console.log("Displaying tunnels");
        BlazeLayout.render("bodyTemplate", {content: "tunnels"});
    }
});


FlowRouter.route('/clients', {
    name: 'clients',
    action: function(params) {
        console.log("Displaying clients");
        BlazeLayout.render("bodyTemplate", {content: "clients"});
    }
});




Meteor.call('getClients', function (err, response) {
  console.log(response);
});
