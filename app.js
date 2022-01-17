
const addTaskWindow = document.querySelector('.addTaskWindow'),
    container = document.querySelector('.container'),
    addLogo = document.querySelector('#addLogo'),
    addButton = document.querySelector('.addButton'),
    inputTask = document.querySelector('.inputTask'),
    taskArea = document.querySelector('.taskArea'),
    startDate = document.querySelector('.startDate'),
    finishDate = document.querySelector('.finishDate'),
    addForm = document.querySelector('.addForm'),
    listTasks = document.querySelector('.listTasks'),
    cancel = document.querySelector('.cancel');

let taskId = Object.keys(localStorage).sort().pop() || 0,
    editId = 0;
    currentDate = new Date();
    
class Task {
    constructor(title, description, startDate, finishDate, id, isComplete){
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.finishDate = finishDate;
        this.id = id;
        this.isComplete = isComplete;
    }
}
addForm.addEventListener('submit', saveNewTask);
addLogo.addEventListener('click', ()=>{addForm.reset(); addTaskWindow.classList.toggle('hide')});
cancel.addEventListener('click', ()=>{editId = 0;addTaskWindow.classList.toggle('hide')});




loadTasksFromLocalStorage();
function loadTasksFromLocalStorage() {
    
    listTasks.innerHTML = '';
    // Object.keys(localStorage).sort().forEach(el => {
    //     createDivTask(JSON.parse(localStorage.getItem(el)));      
    // })
    Object.keys(localStorage).sort((a,b)=>{        
        return Date.parse(JSON.parse(localStorage.getItem(b)).finishDate) - Date.parse(JSON.parse(localStorage.getItem(a)).finishDate)
     }).forEach(el => {
            createDivTask(JSON.parse(localStorage.getItem(el)));      
        })
}

function saveNewTask(e) { 
    e.preventDefault();
    let task = new Task(inputTask.value, taskArea.value, startDate.value, finishDate.value, ++taskId, false);  
    
    if(editId){ 
        task.id = editId;   
        localStorage.removeItem(editId) 
        loadTasksFromLocalStorage();    
    }; 
    createDivTask(task);
    addTaskWindow.classList.toggle('hide');   
}

function createDivTask(taskObj) { 
    localStorage.setItem(taskObj.id, JSON.stringify(taskObj));  

    let divTask = document.createElement('div'),
        header = document.createElement('div'),
        taskTitle = document.createElement('h2'),
        flag = document.createElement('input'),
        details = document.createElement('p'),
        popUpWindow = document.createElement('div'),
        date = document.createElement('div'),
        editButton = document.createElement('button'),
        deleteButton = document.createElement('button');

    editButton.innerText = '✎';
    editButton.classList.add('deleteButton');
    flag.classList.add('deleteButton');
    deleteButton.classList.add('deleteButton');
    deleteButton.innerText = 'x';
    flag.type = 'checkbox';
    flag.checked = taskObj.isComplete;
    divTask.classList.add('task');
    
    taskTitle.innerHTML = taskObj.title;
    details.innerHTML = `ID:${taskObj.id} ${taskObj.description}`;
    popUpWindow.classList.toggle('hide');
    divTask.dataset.id = taskObj.id;

    flag.addEventListener('click', isCompleteChanger); 
    deleteButton.addEventListener('click', deleteTask);
    divTask.addEventListener('click', (e)=>{
        popUpWindow.classList.toggle('hide');
    })
    editButton.addEventListener('click', editTask);

    if(new Date(taskObj.finishDate) < currentDate) {
        date.innerText = 'deadline passed';
        divTask.classList.toggle('passed');
    } else {
        taskObj.isComplete && divTask.classList.add('complete');
        date.innerText = `
        ${convertMiliseconds(new Date(taskObj.finishDate) - currentDate)}
        left until ${taskObj.finishDate}
        `;
    }
    popUpWindow.append(details);
    header.append(taskTitle, date)
    divTask.append(flag, editButton, deleteButton, header, popUpWindow);
    listTasks.insertAdjacentElement('afterbegin', divTask);   
}

function convertMiliseconds(miliseconds) {
    let days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;
    
    total_seconds = parseInt(Math.floor(miliseconds / 1000));
    total_minutes = parseInt(Math.floor(total_seconds / 60));
    total_hours = parseInt(Math.floor(total_minutes / 60));

    days = parseInt(Math.floor(total_hours / 24));
    seconds = parseInt(total_seconds % 60);
    minutes = parseInt(total_minutes % 60);
    hours = parseInt(total_hours % 24);

    return `${days} days \n and ${hours}:${minutes} hours`
  };

function editTask(e) {
    e.stopPropagation();

    addTaskWindow.classList.toggle('hide');
    let task = JSON.parse(localStorage.getItem(e.target.parentNode.dataset.id));
    inputTask.value = task.title;
    taskArea.value = task.description;
    startDate.value = task.startDate;
    finishDate.value = task.finishDate;
    editId = task.id;
}
function deleteTask(el) {
    
    el.stopPropagation();
    let deleteModalWindow = document.createElement('div'),
        yesButton = document.createElement('button'),
        noButton = document.createElement('button');
    
    yesButton.textContent = "YES delete task";
    noButton.textContent = "NO";
    deleteModalWindow.append(yesButton,noButton);
    deleteModalWindow.classList.add('deleteModalWindow');
    document.body.append(deleteModalWindow);

    yesButton.addEventListener('click', ()=>{
        deleteModalWindow.remove();
        localStorage.removeItem(el.target.parentNode.dataset.id);
        el.target.parentNode.remove();
    });
    noButton.addEventListener('click', ()=>{
        deleteModalWindow.remove();
    })  
}

function isCompleteChanger(e) {
    
    e.stopPropagation();
    let task = JSON.parse(localStorage.getItem(e.target.parentNode.dataset.id));
    task.isComplete = !task.isComplete;
    localStorage.setItem(e.target.parentNode.dataset.id, JSON.stringify(task)) 
    e.target.parentNode.classList.toggle('complete');       
}

