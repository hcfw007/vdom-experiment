function view() {
  return h(
    "ul",
    { id: "filmList", className: "list" },
    h(
      "li",
      { className: "main" },
      "Detective Chinatown Vol 2"
    ),
    h(
      "li",
      null,
      "Ferdinand"
    ),
    h(
      "li",
      null,
      "Paddington 2"
    )
  );
}

function flatten(arr) {
  return [].concat(...arr);
}

function h(type, props, ...children) {
  return {
    type,
    props: props || {},
    children: flatten(children)
  };
}

function render(root) {
  root.appendChild(createElement(view(0)));
}

function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  let { type, props, children } = node;
  const el = document.createElement(type);
  setProps(el, props);
  children.map(value => createElement(value)).forEach(value => {
    el.appendChild(value);
  });
  return el;
}

function setProp(target, name, value) {
  if (name === 'className') {
    return target.setAttribute('class', value);
  }

  target.setAttribute(name, value);
}

function setProps(target, props) {
  Object.keys(props).forEach(key => {
    setProp(target, key, props[key]);
  });
}
