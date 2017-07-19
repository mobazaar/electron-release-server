/**
 * Platform Service
 */

var _ = require('lodash');

var ChannelService = {
  // Available channels ordered by desc. stability
  availableChannels: [
    'stable',
    'rc',
    'beta',
    'alpha'
  ]
};

/**
 * Retrieves all available channels given the most restrictive one
 * @param  {String} channel Channel name
 * @return {Array}          Applicable channel names ordered by desc. stability
 */
ChannelService.getApplicableChannels = function(channel) {
  // it should only look for one channel, and not cross environments
  return [channel];
  /*var channelIndex = ChannelService.availableChannels.indexOf(channel);

  if (channelIndex === -1) {
    return ['stable'];
  }

  return 

  return ChannelService.availableChannels.slice(
    0,
    channelIndex + 1
  );*/
};

module.exports = ChannelService;
