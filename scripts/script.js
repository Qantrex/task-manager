document.addEventListener("DOMContentLoaded", function() {
  loadTasksFromCookies();

  var addTaskButton = document.querySelector("#new-column button");
  addTaskButton.addEventListener("click", addTask);

  var tasks = document.querySelectorAll(".tasks div");
  tasks.forEach(function(task) {
    task.addEventListener("click", function() {
      var status = task.dataset.status;
      if (status === "finished") {
        task.parentElement.removeChild(task);
        saveTasksToCookies();
      } else {
        drop({target: task.parentElement}, status === "new" ? "progress" : "finished", task);
        saveTasksToCookies();
      }
    });
  });

  var columns = document.querySelectorAll(".column");
  columns.forEach(function(column) {
    column.addEventListener("drop", function(event) {
      drop(event, column.id);
    });
    column.addEventListener("dragover", allowDrop);
  });
});

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event, targetColumnId, droppedTask) {
  event.preventDefault();
  var taskId = event.dataTransfer.getData("text");
  var task = droppedTask || document.getElementById(taskId);
  var targetColumn = document.getElementById(targetColumnId + "-tasks");
  if (!targetColumn.contains(task)) {
    targetColumn.appendChild(task);
    updateTaskStatus(taskId, targetColumnId);
    saveTasksToCookies();
  }
}

function updateTaskStatus(taskId, newStatus) {
  var task = document.getElementById(taskId);
  task.dataset.status = newStatus;
}

function addTask() {
  var taskInput = document.getElementById("taskInput");
  var taskText = taskInput.value.trim();
  if (taskText !== "") {
    var newTask = document.createElement("div");
    newTask.textContent = taskText;
    newTask.dataset.status = "new";
    newTask.draggable = true;
    newTask.id = "task-" + Math.floor(Math.random() * 1000000);
    newTask.addEventListener("dragstart", drag);
    document.getElementById("new-tasks").appendChild(newTask);
    taskInput.value = "";
    saveTasksToCookies();
  }
}

function saveTasksToCookies() {
  var columns = document.querySelectorAll(".column");
  var tasks = {};
  columns.forEach(function(column) {
    var columnId = column.id;
    var taskData = [];
    column.querySelectorAll(".tasks div").forEach(function(task) {
      if (task.dataset.status !== "finished") {
        taskData.push({
          id: task.id,
          text: task.textContent,
          status: task.dataset.status
        });
      }
    });
    tasks[columnId] = taskData;
  });
  document.cookie = "tasks=" + JSON.stringify(tasks) + "; SameSite=None; Secure";
}

function loadTasksFromCookies() {
  var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)tasks\s*=\s*([^;]*).*$)|^.*$/, "$1");
  if (cookieValue) {
    var tasks = JSON.parse(cookieValue);
    for (var columnId in tasks) {
      var column = document.getElementById(columnId);
      var taskData = tasks[columnId];
      var taskContainer = column.querySelector(".tasks");
      taskData.forEach(function(taskInfo) {
        var task = document.createElement("div");
        task.id = taskInfo.id;
        task.textContent = taskInfo.text;
        task.dataset.status = taskInfo.status;
        task.draggable = true;
        task.addEventListener("dragstart", drag);
        taskContainer.appendChild(task);
      });
    }
  }
}