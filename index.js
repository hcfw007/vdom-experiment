function view() {
  return <ul id="filmList" className="list">
    <li className="main">Detective Chinatown Vol 2</li>
    <li>Ferdinand</li>
    <li>Paddington 2</li>
  </ul>
}


function flatten(arr) {
  return [].concat(...arr)
}

function h(type, props, ...children) {
  return {
    type,
    props: props || {},
    children: flatten(children)
  }
}

function render() {
  console.log(view())
}