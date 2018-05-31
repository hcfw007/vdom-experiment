function view(count) {
  const r = [...Array(count).keys()];
  return h(
    'ul',
    { id: 'filmList', className: `list-${count % 3}` },
    r.map(n => h(
      'li',
      null,
      'item ',
      (count * n).toString()
    ))
  );
}

const CREATE = 'CREATE'; //新增一个节点
const REMOVE = 'REMOVE'; //删除原节点
const REPLACE = 'REPLACE'; //替换原节点
const UPDATE = 'UPDATE'; //检查属性或子节点是否有变化
const SET_PROP = 'SET_PROP'; //新增或替换属性
const REMOVE_PROP = 'REMOVE PROP'; //删除属性

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

function render(el) {
  const initialCount = 0;

  el.appendChild(createElement(view(initialCount)));
  setTimeout(() => tick(el, initialCount), 1000);
}

function tick(el, count) {
  const patches = diff(view(count + 1), view(count));
  patch(el, patches);

  if (count > 5) {
    return;
  }
  setTimeout(() => tick(el, count + 1), 1000);
}

function diff(newNode, oldNode) {
  if (!oldNode) {
    return { type: CREATE, newNode };
  }

  if (!newNode) {
    return { type: REMOVE };
  }

  if (changed(newNode, oldNode)) {
    return { type: REPLACE, newNode };
  }

  if (newNode.type) {
    return {
      type: UPDATE,
      props: diffProps(newNode, oldNode),
      children: diffChildren(newNode, oldNode)
    };
  }
}

function changed(node1, node2) {
  return typeof node1 !== typeof node2 || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type;
}

function diffProps(newNode, oldNode) {
  let patches = [];

  let props = Object.assign({}, newNode.props, oldNode.props);
  Object.keys(props).forEach(key => {
    const newVal = newNode.props[key];
    const oldVal = oldNode.props[key];
    if (!newVal) {
      patches.push({ type: REMOVE_PROP, key, value: oldVal });
    }

    if (!oldVal || newVal !== oldVal) {
      patches.push({ type: SET_PROP, key, value: newVal });
    }
  });

  return patches;
}

function diffChildren(newNode, oldNode) {
  let patches = [];

  const maximumLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maximumLength; i++) {
    patches[i] = diff(newNode.children[i], oldNode.children[i]);
  }

  return patches;
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

function patch(parent, patches, index = 0) {
  if (!patches) {
    return;
  }

  const el = parent.childNodes[index];
  switch (patches.type) {
    case CREATE:
      {
        const { newNode } = patches;
        const newEl = createElement(newNode);
        parent.appendChild(newEl);
        break;
      }
    case REMOVE:
      {
        parent.removeChild(el);
        break;
      }
    case REPLACE:
      {
        const { newNode } = patches;
        const newEl = createElement(newNode);
        return parent.replaceChild(newEl, el);
        break;
      }
    case UPDATE:
      {
        const { props, children } = patches;
        patchProps(el, props);
        for (let i = 0; i < children.length; i++) {
          patch(el, children[i], i);
        }
      }
  }
}

function patchProps(parent, patches) {
  patches.forEach(patch => {
    const { type, key, value } = patch;
    if (type === 'SET_PROP') {
      setProp(parent, key, value);
    }
    if (type === 'REMOVE_PROP') {
      removeProp(parent, key, value);
    }
  });
}

function removeProp(target, name, value) {
  //@
  if (name === 'className') {
    return target.removeAttribute('class');
  }

  target.removeAttribute(name);
}
