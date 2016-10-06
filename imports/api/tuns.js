import { Mongo } from 'meteor/mongo';
 
class TunCollection extends Mongo.Collection {

  update(selector, callback) {

  	// Check if enabled changed
  	// Tuns.find({id: })

   //  let that = this;
   //  setTimeout(function(){
   //  	    Tuns.update(that._id, {
		 //      $set: { state: !that.enabled ? "connected" : "disconnected"}
		 //    });
   //  	}, 700);

  	return super.update(selector, callback);
  }
}


export const Tuns = new TunCollection('tuns');
