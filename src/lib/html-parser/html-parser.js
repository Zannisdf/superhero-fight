const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function parse(html) {
  const {
    window: { document },
  } = new JSDOM(html);

  function find(selector) {
    return document.querySelector(selector);
  }

  function findAll(selector) {
    return document.querySelectorAll(selector);
  }

  function getElementById(id) {
    return document.getElementById(id);
  }

  function getText(element) {
    return element.textContent;
  }

  return {
    find,
    findAll,
    getElementById,
    getText,
  };
}

module.exports = { parse };
