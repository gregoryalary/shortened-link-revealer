const TARGET_DOMAINS = [
  'bit.ly'
];

class TipManager {

  static createTip(url) {
    return function (ev) {
      this.hovered = true;
      this.popupCreated = false;
      var title = this.title;
      this.title = '';
      let that = this;
      if (that.hovered && !that.popupCreated) {
        that.popupCreated = true;
        getTargetLink(url, function (result) {
          if (that.hovered) {
            console.log('-> ' + result);
            if (result) {
              that.setAttribute("shortened_link_revealer_tooltip", 'Redirection : ' + result);
              var tooltipWrap = document.createElement("div");
              tooltipWrap.className = 'shortened_link_revealer_tooltip';
              tooltipWrap.appendChild(document.createTextNode(that.getAttribute('shortened_link_revealer_tooltip')));
              var firstChild = document.body.firstChild;
              firstChild.parentNode.insertBefore(tooltipWrap, firstChild);
              var padding = 5;
              var linkProps = that.getBoundingClientRect();
              var tooltipProps = tooltipWrap.getBoundingClientRect();
              var topPos = linkProps.top - (tooltipProps.height + padding);
              tooltipWrap.setAttribute('style', 'top:' + topPos + 'px;' + 'left:' + linkProps.left + 'px;');
            }
          }
        });
      }
    }
  }

  static cancelTip(ev) {
    this.hovered = false;
    this.popupCreated = false;
    var title = this.getAttribute("shortened_link_revealer_tooltip");
    this.title = title;
    this.removeAttribute("shortened_link_revealer_tooltip");
    let elements = document.querySelector(".shortened_link_revealer_tooltip");
    console.log(elements);
    if (elements) elements.remove();
  }

}

function extractHostname(url) {
  let hostname;
  if (url.indexOf("//") > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];
  return hostname;
}

function findLinks() {
  let links = document.getElementsByTagName('a');
  let shortened_link = [];
  for (let index = 0; index < links.length; index++) {
    if (~TARGET_DOMAINS.indexOf(extractHostname(links[index].href))) {
      shortened_link.push(links[index]);
    }
  }
  return shortened_link;
}

function transformLinks(links) {
  for (let index = 0; index < links.length; index++) {
    links[index].addEventListener('mouseenter', TipManager.createTip(links[index].href));
    links[index].addEventListener('mouseout', TipManager.cancelTip);
  }
}

function getTargetLink(link, callback) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (xhttp.status == 200) {
      callback(xhttp.responseURL);
      xhttp.onreadystatechange = null;
    }
  };
  xhttp.open("GET", link.replace('http://', 'https://'), true);
  xhttp.send();
}

function main() {
  transformLinks(findLinks());
}

main();
