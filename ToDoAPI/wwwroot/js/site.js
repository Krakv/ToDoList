const uri = '/api/TodoItems';
const uriCategories = '/api/ItemCategories';
let todos = [];
let categories = [];

function getItems() {
    getCategories();
    
}

function getCategories() {
    fetch(uriCategories)
        .then(response => response.json())
        .then(data => _displayCategories(data))
        .catch(error => console.error('Unable to get categories.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const categoryId = document.getElementById('categorySelectorAdd').value

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim(),
        categoryId: categoryId
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function addCategory() {
    const addCategoryTextbox = document.getElementById('add-category-name');

    const item = {
        title: addCategoryTextbox.value.trim()
    };

    fetch(uriCategories, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addCategoryTextbox.value = '';
        })
        .catch(error => console.error('Unable to add category.', error));
}

function deleteItem(id) {
    fetch(uri + "/" + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function deleteCategory(id) {
    fetch(uriCategories + "/" + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete category.', error));
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
    document.getElementById('categorySelector').value = item.categoryId;
}

function displayEditCategoryForm(id) {
    const item = categories.find(item => item.id === id);

    document.getElementById('edit-title').value = item.title;
    document.getElementById('edit-category-id').value = item.id;
    document.getElementById('editCategoryForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const categoryId = document.getElementById('categorySelector').value
    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim(),
        categoryId: parseInt(categoryId, 10)
    };

    fetch(uri + '/' + itemId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function updateCategory() {
    const categoryId = document.getElementById('edit-category-id').value;
    const category = {
        id: parseInt(categoryId, 10),
        title: document.getElementById('edit-title').value.trim(),
    };

    fetch(uriCategories + '/' + categoryId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update category.', error));

    closeCategoryInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function closeCategoryInput() {
    document.getElementById('editCategoryForm').style.display = 'none';
}

function _displayCount(isNotCompletedCount, itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    const tBody = document.getElementById('counter');

    tBody.textContent = "ToDos count: " + isNotCompletedCount + "/" + itemCount;
}

function _displayItems(data) {

    let isNotDone = 0;

    const button = document.createElement('button');

    data.forEach(item => {
        let tBody = document.getElementById("categoryId" + item.categoryId);
        tBody.parentElement.style = '';

        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;
        if (!item.isComplete) {
            isNotDone += 1;
        }

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', 'displayEditForm(' + item.id + ')');

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', 'deleteItem(' + item.id + ')');

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.setAttribute('name', 'to-do name');
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);


    });

    _displayCount(isNotDone, data.length);

    todos = data;
}

function _displayCategories(data) {
    const tBody = document.getElementById('categories');
    tBody.innerHTML = '<h2>Categories</h2>';
    const selector = document.getElementById('categorySelector');
    selector.innerHTML = '';
    const selectorAdd = document.getElementById('categorySelectorAdd');
    selectorAdd.innerHTML = '';

    const button = document.createElement('button');

    data.forEach(item => {

        var innerDiv = document.createElement('div');
        innerDiv.id = item.title;
        innerDiv.setAttribute('name', 'category');

        let categoryText = document.createElement('h3');
        categoryText.innerText = item.title;

        let categoryTable = document.createElement('table');
        categoryTable.style = 'display: none;';
        let tr = document.createElement('tr');

        let td1 = document.createElement('th');
        td1.innerText = 'isCompleted';
        tr.appendChild(td1)

        let td2 = document.createElement('th');
        td2.innerText = 'Name';
        tr.appendChild(td2)

        let td3 = document.createElement('th');
        tr.appendChild(td3)

        let td4 = document.createElement('th');
        tr.appendChild(td4)

        let body = document.createElement('tbody');
        body.id = "categoryId" + item.id;


        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', 'displayEditCategoryForm(' + item.id + ')');

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', 'deleteCategory(' + item.id + ')');

        let categoryRow = document.createElement('tr');
        categoryRow.id = "categoryRow";
        let td11 = categoryRow.insertCell(0)
        td11.style = 'border: 0px';
        td11.appendChild(categoryText);
        if (item.id != 1) {
            let td12 = categoryRow.insertCell(1)
            td12.style = 'border: 0px';
            td12.appendChild(editButton);
            let td13 = categoryRow.insertCell(2);
            td13.style = 'border: 0px';
            td13.appendChild(deleteButton);
        }

        tBody.appendChild(innerDiv);
        innerDiv.appendChild(categoryRow);
        innerDiv.appendChild(categoryTable);
        categoryTable.appendChild(tr);
        categoryTable.appendChild(body);

        let option = document.createElement('option');
        option.value = item.id;
        option.text = item.title;
        selector.appendChild(option);
        selectorAdd.appendChild(option.cloneNode(true));

    });

    categories = data;

    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}



