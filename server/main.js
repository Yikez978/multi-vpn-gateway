import { Meteor } from 'meteor/meteor';
import { Tuns } from '../imports/api/tuns.js';
import { Clients } from '../imports/api/clients.js';
import { VpnConfigs } from '../imports/api/vpnconfigs.js';
import { OpenVpnConnectionManager } from './openvpnconnectionmanager.js';
import * as Shell from './mockshell.js';

let vpnConnections = {};

Meteor.startup(function () {

  // Populate vpn configs
  VpnConfigs.remove({});
  Shell.getVpnConfigs().forEach(c => VpnConfigs.insert(c));


  // Update clients collection
  Clients.update({}, {$set: {active: false}}, {multi: true});
  Shell.getClients().forEach((c) => {
    let ec = Clients.findOne({ip: c.ip});
    if(ec)
      Clients.update({ip: c.ip}, {$set: {active: true, hostname: c.hostname}});
    else
      Clients.insert({ip: c.ip, hostname: c.hostname, active: c.active, tunId: 0});
  });


  // Update clients colleciton from firewall rules?

  // Restore vpn connections from mgmt sockets?


  // Load server side hooks

  Clients.after.update((userId, doc, fieldNames, modifier, options)  => {

    if(fieldNames.includes("tunId")){
      if(doc.tunId == 0){
        Shell.unrouteClient(doc.ip);
      } else {
        let tun = Tuns.findOne({_id: new Mongo.ObjectID(doc.tunId) });
        Shell.routeClient(doc.ip, tun.name);
      }
    }


  })

  Tuns.before.update((userId, doc, fieldNames, modifier, options)  => {

    modifier.$set = modifier.$set || {};

    // if(fieldNames.includes("enabled")){
    //   if(modifier.$set.enabled){
    //     Shell.connectTunnel(doc.name, doc.vpnconfig);

    //     modifier.$set.state = "connecting";
    //     setTimeout(Meteor.bindEnvironment(() => {
    //           Tuns.update(doc._id, {
    //           $set: { state: "connected"}
    //         });
    //       }), 700);

    //   } else {
    //     Shell.disconnectTunnel(doc.name)

    //     modifier.$set.state = "disconnecting";
    //     setTimeout(Meteor.bindEnvironment(() => {
    //           Tuns.update(doc._id, {
    //           $set: { state: "disconnected"}
    //         });
    //       }), 700);
    //   }
    // }
  });


  Tuns.after.update((userId, doc, fieldNames, modifier, options)  => {

    // TODO unblock

    // Configuration changed
    if(fieldNames.includes("vpnconfig") && doc.enabled){
        if(vpnConnections.hasOwnProperty(doc.name)){
          // Disconnect if already connected
          vpnConnections[doc.name].disconnect();
          delete vpnConnections[doc.name];
        }

        vpnConnections[doc.name] = new OpenVpnConnectionManager(doc.name, doc.vpnconfig);
        vpnConnections[doc.name].connect();

    }

    // Enable changed
    if(fieldNames.includes("enabled")){
      if(doc.enabled){
        // Connect
        if(vpnConnections.hasOwnProperty(doc.name)){
          // Disconnect if already connected
          vpnConnections[doc.name].disconnect();
          delete vpnConnections[doc.name];
        }

        vpnConnections[doc.name] = new OpenVpnConnectionManager(doc.name, doc.vpnconfig);
        vpnConnections[doc.name].connect();

      } else {

        // Disconnect
        if(vpnConnections.hasOwnProperty(doc.name)){
          // Disconnect if already connected
          vpnConnections[doc.name].disconnect();
          delete vpnConnections[doc.name];
        }

      }
    }


  });


  // Load future from fibers
  var Future = Npm.require("fibers/future");
  // Load exec
  var exec = Npm.require("child_process").exec;
 
  // Server methods
  Meteor.methods({
    runCode: function () {
      // This method call won't return immediately, it will wait for the
      // asynchronous code to finish, so we call unblock to allow this client
      // to queue other method calls (see Meteor docs)
      this.unblock();
      var future=new Future();
      var command="pwd";
      exec(command,function(error,stdout,stderr){
        if(error){
          console.log(error);
          throw new Meteor.Error(500,command+" failed");
        }
        future.return(stdout.toString());
      });
      return future.wait();
    },

    getClients: function () {
    	return Shell.getClients();
    }
  });
});