const TARGET_DOMAINS = [
  'bit.ly'
];

class TipManager {

  static createTip(url) {
    return function (ev) {
      this.hovered = true;
      var title = this.title;
      this.title = '';
      let that = this;
      getTargetLink(url, function (result) {
        if (that.hovered) {
          console.log('-> ' + result);
          that.setAttribute("shortened_link_revealer_tooltip", 'Bitly redirection : ' + result);
          var tooltipWrap = document.createElement("div");
          tooltipWrap.className = 'shortened_link_revealer_tooltip';
          tooltipWrap.appendChild(document.createTextNode('Bitly redirection : ' + result));
          var firstChild = document.body.firstChild;
          firstChild.parentNode.insertBefore(tooltipWrap, firstChild);
          var padding = 5;
          var linkProps = that.getBoundingClientRect();
          var tooltipProps = tooltipWrap.getBoundingClientRect();
          var topPos = linkProps.top - (tooltipProps.height + padding);
          tooltipWrap.setAttribute('style', 'top:' + topPos + 'px;' + 'left:' + linkProps.left + 'px;');
        }
      });
    }
  }

  static cancelTip(ev) {
    if (this.hovered) {
      this.hovered = false;
      var title = this.getAttribute("shortened_link_revealer_tooltip");
      this.title = title;
      this.removeAttribute("shortened_link_revealer_tooltip");
      let elements = document.querySelector(".shortened_link_revealer_tooltip");
      if (elements) elements.remove();
    }
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
    if (this.readyState == 4 && this.status == 200) {
      let result = this.responseText.split("long_url_no_protocol\": \"");
      if (result[1]) {
        result = result[1];
      } else {
        callback(link);
      }
      result = result.split("\"");
      if (result[0]) {
        callback(result[0]);
      } else {
        callback(link);
      }
    }
  };
  xhttp.open("GET", link.replace('http://', 'https://') + '+', true);
  xhttp.send();
}

function main() {
  transformLinks(findLinks());
}

main();
