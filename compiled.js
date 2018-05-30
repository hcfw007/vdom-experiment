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

function render() {
  console.log(view());
}
