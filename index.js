const components = require('./components/index');
const data = require('./data/index');
const ui = require('./ui/index');
const ux = require('./ux/index');

module.exports = {
  () => require('./components/index'),
  () => require('./data/index'),
  () => require('./ui/index'),
  () => require('./ux/index')
}
