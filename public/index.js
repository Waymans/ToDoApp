const todo = document.getElementById('todo');
const display = document.getElementById('todoDisplay');
const user = document.getElementById('id');

function maker(data) {
  var a = 'a',b = 'b';
  var container = document.createElement('div');
  container.setAttribute('class', 'card-container');
  data.todo.forEach(x => {
    todoList(x, container, a);
  });
  if (data.done) {
    data.done.forEach(x => {
      todoList(x, container, b);
    });
  }
  display.appendChild(container);
}

function todoList(x, container, y) {
  var rand = Math.random().toString(36).substring(2,6);
  var item = document.createElement('div');
  item.setAttribute('id', rand);
  item.setAttribute('class', 'card show');
  item.innerHTML = x;
  var remove = document.createElement('span');
  remove.setAttribute('class', 'remove');
  remove.innerHTML = '&times;';
  remove.addEventListener('click', del);
  var close = document.createElement('span');
  close.setAttribute('class', 'close');
  close.innerHTML = '&#9711;';
  close.addEventListener('click', check);
  item.appendChild(close);
  item.appendChild(remove);
  container.appendChild(item);
  if (y === 'b') {
    todoChecked(item);
  }
}
function todoChecked(ele) {
  var child = document.createElement('span');
  child.setAttribute('class', 'check');
  child.innerHTML = '&check;';
  child.addEventListener('click', check);
  ele.appendChild(child);
  ele.classList.add('checked');
}

var id = user.innerHTML;
var data = { id: id };
var fetchData = { 
  method: 'GET', 
  body: JSON.stringify(data),
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'} } 
fetch('/todo/'+id)
  .then((resp) => resp.json())
  .then(function(data) {
    maker(data);
  });

todo.addEventListener('submit', function(e) {
  e.preventDefault();
  var thing = e.target[0].value;
  var data = { thing: thing }
  var fetchData = { 
    method: 'PUT', 
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'} } 
  fetch('/todo/'+id, fetchData)
    .then((resp) => resp.json())
    .then(function(data) { 
      maker(data);     
      todo.children[1].value = '';
    })
});

function del(e) {
  e.preventDefault();
  var item = e.target.parentElement.id;
  var child = document.getElementById(item);
  var thing = e.target.parentElement.firstChild.data;
  var data = { thing: thing }
  display.firstChild.removeChild(child);
  var fetchData = { 
    method: 'DELETE', 
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'} } 
  if (!e.target.parentElement.classList[1]) {
    fetch('/todo/'+id, fetchData)
    .then((resp) => resp.json())
    .then(function(data) { 
      display.firstChild.removeChild(child); // slow on client side
    });
  } else {
    fetch('/remove/'+id, fetchData)
    .then((resp) => resp.json())
    .then(function(data) { 
      display.firstChild.removeChild(child); // slow on client side
    });
  }
};

function check(e) { // need data 
  e.preventDefault();
  var data = { thing: e.target.parentElement.firstChild.data }
  var parent = e.target.parentElement;
  if (e.target.parentElement.children.length >= 3) {
    var last = e.target.parentElement.lastChild;
    parent.removeChild(last); // document.getElementById(parent.id)
    parent.style.background = '#eee';
    parent.style.textDecoration = 'none';
    unchecked(data);
  } else {
    todoChecked(parent);
    checked(data);
  }
};

function checked(data) {
  var fetchData = { 
    method: 'PUT', 
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'} } 
  fetch('/check/'+id, fetchData)
    .then((resp) => resp.json())
    .then(function(data) { 

    })
};
function unchecked(data) {
  var fetchData = { 
    method: 'PUT', 
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'} } 
  fetch('/uncheck/'+id, fetchData)
    .then((resp) => resp.json())
    .then(function(data) { 

    })
};

//////////////////// DRY
document.getElementById('showAll').addEventListener('click', e => {
  var ele = display.children[0].childNodes;
  ele.forEach(x => {
    x.className = x.className.replace(" hide", " show");
  })
});
document.getElementById('showTodo').addEventListener('click', e => {
  var ele = display.children[0].childNodes;
  ele.forEach(x => {
    if (x.className.includes('checked')) {
      x.className = x.className.replace(" show", " hide");
    } else {
       x.className = x.className.replace(" hide", " show"); 
    }
  })
});
document.getElementById('showDone').addEventListener('click', e => {
  var ele = display.children[0].childNodes;
  ele.forEach(x => {
   if (!x.className.includes('checked')) {
      x.className = x.className.replace(" show", " hide");
    } else {
       x.className = x.className.replace(" hide", " show"); 
    }
  })
});

document.getElementById('bars').addEventListener('click', e => {
  var x = document.getElementById('nav');
  if (x.className.indexOf("hide") !== -1) {
    x.className = x.className.replace(" hide", " show");
  } else { 
    x.className = x.className.replace(" show", " hide");
  }
});

//window.onload = function(e) {
//}


//list.setAttribute('draggable', 'true');
//list.setAttribute('ondragstart','drag(event)');
//list.setAttribute('ondragend','end(event)');
//list.setAttribute('ondragover','dragOver(event)'); 

// DnD
/*var el;
function allowDrop(e) {
  e.preventDefault();
  }
function end(e) {
  var ids = e.target.id ? ids = e.target.id: null;
  document.getElementById(ids) ? document.getElementById(ids).style.opacity = 1: null;
  e.dataTransfer.setData("Text",ids); 
}
function drop(e) {
  e.preventDefault();
  var data = e.dataTransfer.getData("Text");
  var el = document.getElementById(data);
  el.parentNode.removeChild(el);
}
function drag(e) {
  var ids = e.target.id ? ids = e.target.id: null;
  document.getElementById(ids).style.opacity = 0;
  e.dataTransfer.setData("Text",ids);
  
  ////////////////////////////////////////////////////////////////////// need to study below
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", null);
  el = e.target;
}
function dragOver(e) {
  if (isBefore(el, e.target))
    e.target.parentNode.insertBefore(el, e.target);
  else
    e.target.parentNode.insertBefore(el, e.target.nextSibling);
}
function isBefore(el1, el2) {
  if (el2.parentNode === el1.parentNode)
    for (var cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling)
      if (cur === el2)
        return true;
  return false;
}*/