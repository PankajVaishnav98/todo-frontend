function logout(){

  document.cookie="username=; expires=Sun, 20 Aug 2000 12:00:00 UTC";
  document.cookie="auth-token=; expires=Sun, 20 Aug 2000 12:00:00 UTC";
  location.replace("../index.html")

}

function login() {
  let username = document.getElementById("l_usernameId").value;
  let password = document.getElementById("l_passwordId").value;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8080/user/authenticate");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    console.log(xhr.status);
    console.log(xhr.responseText);
    if (xhr.readyState === 4) {
      if (xhr.status != 202) {
        document.getElementById("loginMsg").innerHTML =
          "Failed to login, enter correct details";
      } else {
        setCookie(xhr.responseText, username);
        location.replace("../dashboard.html");
      }
    }
  };

  let data = `{
    "username": \"${username}\",
    "password": \"${password}\"}`;

  xhr.send(data);
} // end of login function


function signUp(){
  window.alert("hlw");
  let username = document.getElementById("s_usernameId").value;
  let email = document.getElementById("s_emailId").value;
  let password = document.getElementById("s_passwordId").value;

  let xhr = new XMLHttpRequest();
  xhr.open("POST","http://localhost:8080/user/register");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function(){
    console.log(xhr.status);
    console.log(xhr.responseText);
    if(xhr.readyState === 4){
      if(xhr.status != 201){
        document.getElementById("signUpMsg").innerHTML =
          "Failed to create user, enter correct details";
      }
      else{
          document.getElementById("pills-home-tab").click();
          document.getElementById("loginMsg").innerHTML =
          "Account created successfully.";
      }
    }
  }

  let data = `{
    "username": \"${username}\",
    "email": \"${email}\",
    "password": \"${password}\"}`;

  xhr.send(data);

}

function setCookie(token, username) {
  document.cookie = `auth-token=${token}`;
  document.cookie = `username=${username}`;
} // end of setJwtInCookie

function loadTodoList() {
  let xhr = new XMLHttpRequest();
  let jwt_token = getCookie("auth-token");
  validateSession(jwt_token);
  let token = `Bearer ${jwt_token}`;
  xhr.open("GET", "http://localhost:8080/todo");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "Origin, Authorization");
  xhr.setRequestHeader("Authorization", token);
  //xhr.setRequestHeader("Accept", "application/json");
  //xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    console.log(xhr.status);
    console.log(xhr.responseText);
    if (xhr.readyState === 4) {
      if (xhr.status != 200) {
        document.getElementById("todoListLoadFailed").innerHTML =
          "Failed to load todo list.";
      } else {
        //window.alert(xhr.responseText);
        let data = JSON.parse(xhr.responseText);
        let htmlData = "";
        if (data.length == 0) {
          htmlData = `<div class="info bg-primary">
          <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
          <strong>Information!</strong> Your todo list is empty. Please add some todo.

        </div>`;
        } else {
          for (const key in data) {
            htmlData += `<a href="#" class="list-group-item list-group-item-action todoListItem" id="todo_${key}">
                                      <div class="d-flex w-100 justify-content-between" id="titleDateId_${key}">
                                          <h5 class="mb-1" id="titleId_${key}">${data[key].title}</h5>
                                          <small id="date_${key}">${data[key].targetDate}</small>
                                      </div>
                                      <div class="d-flex w-100 justify-content-between" id="descDivId_${key}">
                                          <p class="mb-1" id="desc_${key}">${data[key].description}</p>
                                          <div id="updateDeleteDiv_${key}" class='d-flex gap-3 w-25' > 
                                              <button type="button" id="updateButton_${key}" class="btn w-100 btn-success" onclick="updateTodo('${data[key].title}',${key},'${data[key].description}','${data[key].targetDate}');">Update Todo</button>
                                              <button type="button" class="btn btn-danger w-100" onclick="deleteTodo('${data[key].title}',${key});">Delete Todo</button>
                                          </div>
                                      </div>
                                      <div class="d-flex w-100 justify-content-between" id="msgDivId_${key}">
                                          <p id="msgId_${key}"></p>
                                      </div>
                                      
                                  </a></br>`;
          }
        }
        document.getElementById("mainMsgId").innerHTML = `<h3>Your Todo List</h3>`;
        document.getElementById("todoListId").innerHTML = htmlData;
      }
    }
  };

  xhr.send();
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function loadUserProfile() {
  username = getCookie("username");
  validateSession(username);
  document.getElementById("profileNameId").innerHTML = `${username}`;
  document.getElementById("mainMsgId").innerHTML = `<h3>Welcome ${username}</h3>`;
}

function loadDashBoard(){
  document.getElementById("todoListId").innerHTML = '';
  document.getElementById("addTodoId").innerHTML = '';
  document.getElementById("mainMsgId").innerHTML = `<h3>Welcome ${getCookie("username")}</h3>`;
}

function deleteTodo(titleToDelete, key) {
  let xhr = new XMLHttpRequest();
  let jwt_token = getCookie("auth-token");
  validateSession(jwt_token);
  let token = `Bearer ${jwt_token}`;
  xhr.open("DELETE", `http://localhost:8080/todo?title=${titleToDelete}`);
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "DELETE");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "Origin, Authorization");
  xhr.setRequestHeader("Authorization", token);

  xhr.onreadystatechange = function () {
    console.log(xhr.status);
    console.log(xhr.responseText);
    if (xhr.readyState === 4) {
      if (xhr.status != 202) {
        document.getElementById(`msgId_${key}`).innerHTML =
          "Failed to delete todo.";
      } else {
        document.getElementById(
          `todo_${key}`
        ).innerHTML = `<div class="info bg-success">
          <span class="closebtn" onclick="this.parentElement.parentElement.style.display='none';">&times;</span> 
          <strong>Information!</strong> Deleted todo successfully. Please add new some todo.
        </div>`;
      }
    }
  };

  xhr.send();
}

function updateTodo(titleToUpdate, key, oldDesc, oldDate) {
  console.log(oldDate);
  document.getElementById(
    `msgDivId_${key}`
  ).innerHTML = `<p id="msgId_${key}">you are updating the todo.</p>`;
  document.getElementById(
    `titleDateId_${key}`
  ).innerHTML = `<h5 class="mb-1" id="titleId_${key}">${titleToUpdate}</h5>
    <input type="datetime-local" id="newDate_${key}" name="targetDate">`;
  document.getElementById(
    `descDivId_${key}`
  ).innerHTML = `<input type="text" id="newDesc_${key}" value="${oldDesc}" name="description">
  <div id="updateDeleteDiv_${key}" class='d-flex gap-3 w-25'>
    <button type="button" id="saveButton_${key}" class="btn w-100 btn-success" onclick="updateTodoCallBackend('${titleToUpdate}',${key});">Save</button>
    <button type="button" id="cancelButton_${key}" class="btn w-100 btn-danger" onclick="updateCancelled('${titleToUpdate}', '${oldDesc}','${oldDate}',${key});">Cancel</button>
  </div>`;
}

function updateCancelled(title, oldDesc, oldDate, key) {
  document.getElementById(
    `msgDivId_${key}`
  ).innerHTML = `<p id="msgId_${key}"></p>`;
  document.getElementById(
    `titleDateId_${key}`
  ).innerHTML = `<h5 class="mb-1" id="title_${key}">${title}</h5>
                <small id="date_${key}">${oldDate}</small>`;
  document.getElementById(
    `descDivId_${key}`
  ).innerHTML = `<p class="mb-1" id="desc_${key}">${oldDesc}</p>
                  <div id="updateDeleteDiv_${key}" class='d-flex gap-3 w-25'>
                    <button type="button" id="updateButton_${key}" class="btn btn-success" onclick="updateTodo('${title}',${key},'${oldDesc}','${oldDate}');">Update Todo</button>
                    <button type="button" class="btn btn-danger" onclick="deleteTodo('${title}',${key});">Delete Todo</button>
                  </div>`;
}

function updateTodoCallBackend(title, key) {
  let newDate = document.getElementById(`newDate_${key}`).value;
  let newDesc = document.getElementById(`newDesc_${key}`).value;
  let jwt_token = getCookie("auth-token");
  validateSession(jwt_token);
  let token = `Bearer ${jwt_token}`;
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", "http://localhost:8080/todo");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "PUT");
  xhr.setRequestHeader(
    "Access-Control-Allow-Headers",
    "Origin, Authorization",
    "Accept",
    "Content-Type"
  );
  xhr.setRequestHeader("Authorization", token);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    console.log(xhr.status);
    console.log(xhr.responseText);
    if (xhr.readyState === 4) {
      if (xhr.status != 202) {
        document.getElementById(`msgId_${key}`).innerHTML =
          "Failed to update todo.";
      } else {
        document.getElementById(
          `titleDateId_${key}`
        ).innerHTML = `<h5 class="mb-1" id="title_${key}">${title}</h5>
                                                                         <small id="date_${key}">${newDate}</small>`;
        document.getElementById(
          `descDivId_${key}`
        ).innerHTML = `<p class="mb-1" id="desc_${key}">${newDesc}</p>
                                                                       <div id="updateDeleteDiv_${key}" class='d-flex gap-3 w-25'>
                                                                            <button type="button" id="updateButton_${key}" class="btn btn-success" onclick="updateTodo('${title}',${key},'${newDesc}','${newDate}');">Update Todo</button>
                                                                       </div>`;
        document.getElementById(
          `msgDivId_${key}`
        ).innerHTML = `<p id="msgId_${key}">Updated todo successfully.</p>
        <button type="button" class="btn btn-danger" onclick="deleteTodo('${title}',${key});">Delete Todo</button>`;
      }
    }
  };

  let data = `{
        "title": \"${title}\",
        "description": \"${newDesc}\",
        "targetDate": \"${newDate}\"}`;
  xhr.send(data);
}

function addTodo() {
  document.getElementById("addTodoId").innerHTML = 
  `<a href="#" class="list-group-item list-group-item-action todoListItem" id="todo_add">
      <div class="d-flex w-100 justify-content-between" id="titleDateId_add">
        <input type="text" id="titleId_add" value="title" name="title">
        <input type="datetime-local" id="date_add" value="" name="date">
      </div>
      <div class="d-flex w-100 justify-content-between" id="descDivId_add">
          <input type="message" id="desc_add" value="description" name="description">
          <div id="updateDeleteDiv_add" class='d-flex gap-3 w-25' > 
              <button type="button" id="updateButton_add" class="btn w-100 btn-success" onclick="addTodoBackendCall();">Add Todo</button>
              <button type="button" class="btn btn-danger w-100" onclick="cancelAddTodo();">Cancel</button>
          </div>
      </div>
      <div class="d-flex w-100 justify-content-between" id="msgDivId_add">
        <p id="msgId_add">Adding new todo.</p>
      </div>
    </a></br>`;

} // end of addTodo

function cancelAddTodo(){
  document.getElementById("todo_add").remove();
}

function addTodoBackendCall(){
  let title = document.getElementById("titleId_add").value;
  let description = document.getElementById("desc_add").value;
  let targetDate = document.getElementById("date_add").value;
  let jwt_token = getCookie("auth-token");
  validateSession(jwt_token);
  let token = `Bearer ${jwt_token}`;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8080/todo");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "Origin, Authorization");
  xhr.setRequestHeader("Authorization", token);

  xhr.onreadystatechange = function () {
    console.log(xhr.status);
    console.log(xhr.responseText);
    if (xhr.readyState === 4) {
      if (xhr.status != 201) {
        document.getElementById("msgId_add").innerHTML =
          "Failed to add todo.";
      } else {
        console.log(xhr.responseText);
        document.getElementById("addTodoId").innerHTML = '';
        loadTodoList();
      }
    }
  };

  let data = `{
    "title": \"${title}\",
    "description": \"${description}\",
    "targetDate": \"${targetDate}\"}`;

  xhr.send(data);


}

function validateSession(cookieValue){
  if(cookieValue == ""){
    window.alert("Session Time Out. Login Back!");
    location.replace("index.html");
  }
}