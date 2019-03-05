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
      display.firstChild.removeChild(child);
    });
  } else {
    fetch('/remove/'+id, fetchData)
    .then((resp) => resp.json())
    .then(function(data) { 
      display.firstChild.removeChild(child);
    });
  }
};
function check(e) { 
  e.preventDefault();
  var data = { thing: e.target.parentElement.firstChild.data }
  var parent = e.target.parentElement;
  if (e.target.parentElement.children.length >= 3) {
    var last = e.target.parentElement.lastChild;
    parent.removeChild(last);
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

// filter list
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
// small navbar
document.getElementById('bars').addEventListener('click', e => {
  var x = document.getElementById('nav');
  if (x.className.indexOf("hide") !== -1) {
    x.className = x.className.replace(" hide", " show");
  } else { 
    x.className = x.className.replace(" show", " hide");
  }
});
// alert box
document.getElementById('times').addEventListener('click', e => {
  e.target.parentElement.parentElement.style.display='none';
})