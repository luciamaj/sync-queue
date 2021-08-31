// Copyright 2014 Technical Machine, Inc.
//
// Licensed under the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>. 
// This file may not be copied, modified, or distributed
// except according to those terms.
var util = require('util');
var emitter = require('events').EventEmitter;

function queue(name, info) {
  var me = this;
  emitter.call(this);

  this.name = name;
  this.info = info;
  // Create an empty array of commands
  this.queue = [];
  // We're inactive to begin with
  this.queue.active = false;
  // Method for adding command chain to the queue
  this.queue.place = function (command, commandId) { 
    // Push the command onto the command array
    me.queue.push({command: command, id: commandId ? commandId : me.queue.push.length++});
    // If we're currently inactive, start processing
    if (!me.queue.active) me.queue.next();
  };
  // Method for calling the next command chain in the array
  this.queue.next = function () {
    // If this is the end of the queue
    if (!me.queue.length) {
      // We're no longer active
      me.queue.active = false;
      // Stop execution
      me.emit('end');
      return;
    }
    // Grab the next command
    var commandObj = me.queue.shift();
    // We're active
    me.queue.active = true;
    // Call the command
    me.emit('next', me.queue.length, commandObj.id);

    commandObj.command();
  };
  //Clearing queue
  this.queue.clear = function() {
    me.queue.length = 0;
    me.queue.active = false;
  };

  return this;
}

util.inherits(queue, emitter);

module.exports = queue;
