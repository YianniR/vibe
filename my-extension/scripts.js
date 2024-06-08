// const Utils = {
//     isValidUrl: (url) => {
//         try {
//             new URL(url);
//             return true;
//         } catch (_) {
//             return false;
//         }
//     },
//     addHttp: (url) => {
//         if (!/^https?:\/\//i.test(url)) {
//             return 'http://' + url;
//         }
//         return url;
//     },
//     saveToLocalStorage: (key, data) => {
//         localStorage.setItem(key, JSON.stringify(data));
//     },
//     loadFromLocalStorage: (key) => {
//         return JSON.parse(localStorage.getItem(key)) || [];
//     },
//     getFaviconUrl: (url) => {
//         const domain = new URL(url).hostname;
//         return `https://www.google.com/s2/favicons?domain=${domain}`;
//     },
//     showMessage: (message, type) => {
//         const messageElement = document.getElementById('message');
//         messageElement.textContent = message;
//         messageElement.className = `message ${type}`;
//         messageElement.style.display = 'block';
//         setTimeout(() => {
//             messageElement.style.display = 'none';
//         }, 3000);
//     }
// };

// const WebsiteManager = {
//     gridContainers: Utils.loadFromLocalStorage('gridContainers'),

//     init: function () {
//         this.cacheDom();
//         this.bindEvents();
//         this.render();
//     },

//     cacheDom: function () {
//         this.homePageButton = document.getElementById('homePageButton');
//         this.editPageButton = document.getElementById('editPageButton');
//         this.settingsPageButton = document.getElementById('settingsPageButton');
//         this.mainPage = document.getElementById('mainPage');
//         this.editPage = document.getElementById('editPage');
//         this.settingsPage = document.getElementById('settingsPage');
//         this.gridContainersWrapper = document.getElementById('gridContainersWrapper');
//         this.editGridContainersWrapper = document.getElementById('editGridContainersWrapper');
//         this.addWebsiteButton = document.getElementById('addWebsiteButton');
//         this.addGridContainerButton = document.getElementById('addGridContainerButton');
//         this.websiteNameInput = document.getElementById('websiteName');
//         this.websiteUrlInput = document.getElementById('websiteUrl');
//         this.faviconUrlInput = document.getElementById('faviconUrl');
//     },

//     bindEvents: function () {
//         this.homePageButton.addEventListener('click', this.goToHomePage.bind(this));
//         this.editPageButton.addEventListener('click', this.goToEditPage.bind(this));
//         this.settingsPageButton.addEventListener('click', this.goToSettingsPage.bind(this));
//         this.addWebsiteButton.addEventListener('click', this.addWebsite.bind(this));
//         this.addGridContainerButton.addEventListener('click', this.addGridContainer.bind(this));
//         this.editGridContainersWrapper.addEventListener('click', this.handleGridContainerClick.bind(this));
//         this.editGridContainersWrapper.addEventListener('dragstart', this.onDragStart.bind(this));
//         this.editGridContainersWrapper.addEventListener('dragover', this.onDragOver.bind(this));
//         this.editGridContainersWrapper.addEventListener('drop', this.onDrop.bind(this));
//     },

//     render: function () {
//         this.renderGridContainers();
//     },

//     goToHomePage: function () {
//         this.mainPage.style.display = 'block';
//         this.editPage.style.display = 'none';
//         this.settingsPage.style.display = 'none';
//         this.toggleBordersAndShadows(true);
//         this.renderGridContainers(); // Ensure the homepage grid containers are re-rendered
//     },

//     goToEditPage: function () {
//         this.mainPage.style.display = 'none';
//         this.editPage.style.display = 'block';
//         this.settingsPage.style.display = 'none';
//         this.renderGridContainersForEdit();
//         this.toggleBordersAndShadows(false);
//     },

//     goToSettingsPage: function () {
//         this.mainPage.style.display = 'none';
//         this.editPage.style.display = 'none';
//         this.settingsPage.style.display = 'block';
//         this.toggleBordersAndShadows(true);
//     },

//     toggleBordersAndShadows: function (remove) {
//         const gridContainers = document.querySelectorAll('.grid-container');
//         const gridColumns = document.querySelectorAll('.grid-column');

//         gridContainers.forEach(container => {
//             if (remove) {
//                 container.classList.add('render-mode');
//             } else {
//                 container.classList.remove('render-mode');
//             }
//         });

//         gridColumns.forEach(column => {
//             if (remove) {
//                 column.classList.add('render-mode');
//             } else {
//                 column.classList.remove('render-mode');
//             }
//         });
//     },

//     makeDraggable: function (isEditable) {
//         const draggableItems = document.querySelectorAll('.grid-item');
//         draggableItems.forEach(item => {
//             item.setAttribute('draggable', isEditable);
//         });
//     },

//     renderGridContainers: function () {
//         this.gridContainersWrapper.innerHTML = '';
//         this.gridContainers.forEach((container, containerIndex) => {
//             const containerElement = this.createGridContainerElement(container, containerIndex, false);
//             this.gridContainersWrapper.appendChild(containerElement);
//         });
//     },

//     renderGridContainersForEdit: function () {
//         this.editGridContainersWrapper.innerHTML = '';
//         this.gridContainers.forEach((container, containerIndex) => {
//             const containerElement = this.createGridContainerElement(container, containerIndex, true);
//             this.editGridContainersWrapper.appendChild(containerElement);
//         });
//     },

//     createGridContainerElement: function (container, containerIndex, isEditMode) {
//         const containerElement = document.createElement('div');
//         containerElement.classList.add('grid-container');
//         containerElement.setAttribute('id', `gridContainer${containerIndex}`);

//         if (isEditMode) {
//             const deleteContainerButton = document.createElement('button');
//             deleteContainerButton.classList.add('delete-container-button');
//             deleteContainerButton.innerHTML = '×';
//             deleteContainerButton.addEventListener('click', () => this.deleteGridContainer(containerIndex));
//             containerElement.appendChild(deleteContainerButton);
//         }

//         const gridsWrapper = document.createElement('div');
//         gridsWrapper.classList.add('grids-wrapper');
//         gridsWrapper.setAttribute('id', `gridsWrapper${containerIndex}`);

//         container.grids.forEach((grid, gridIndex) => {
//             const gridElement = this.createGridElement(grid, containerIndex, gridIndex, isEditMode);
//             gridsWrapper.appendChild(gridElement);
//         });

//         if (isEditMode && container.grids.length < 5) {
//             const addGridButton = document.createElement('button');
//             addGridButton.classList.add('addGridButton', 'add-grid-button');
//             addGridButton.setAttribute('data-container-id', containerIndex);
//             addGridButton.innerHTML = '<i class="fas fa-plus"></i>';
//             gridsWrapper.appendChild(addGridButton); // Ensure the button is added at the end
//         }

//         containerElement.appendChild(gridsWrapper);

//         return containerElement;
//     },

//     createGridElement: function (grid, containerIndex, gridIndex, isEditMode) {
//         const gridElement = document.createElement('div');
//         gridElement.classList.add('grid-column');
//         gridElement.setAttribute('data-grid-index', gridIndex);
//         gridElement.setAttribute('data-container-index', containerIndex);

//         if (isEditMode) {
//             const deleteColumnButton = document.createElement('button');
//             deleteColumnButton.classList.add('delete-column-button');
//             deleteColumnButton.innerHTML = '×';
//             deleteColumnButton.addEventListener('click', () => this.deleteGrid(containerIndex, gridIndex));
//             gridElement.appendChild(deleteColumnButton);
//         }

//         const titleElement = document.createElement('div');
//         titleElement.classList.add('grid-title');
//         titleElement.textContent = grid.title;
//         if (isEditMode) {
//             titleElement.setAttribute('contenteditable', 'true');
//             titleElement.addEventListener('blur', () => {
//                 this.updateGridTitle(containerIndex, gridIndex, titleElement.textContent);
//             });
//         }

//         gridElement.appendChild(titleElement);

//         const websitesContainer = document.createElement('div');
//         websitesContainer.classList.add('grid');
//         websitesContainer.setAttribute('data-grid-index', gridIndex);
//         websitesContainer.setAttribute('data-container-index', containerIndex);

//         grid.websites.forEach((website, websiteIndex) => {
//             const websiteElement = this.createWebsiteElement(website, containerIndex, gridIndex, websiteIndex, isEditMode);
//             websitesContainer.appendChild(websiteElement);
//         });

//         gridElement.appendChild(websitesContainer);

//         return gridElement;
//     },

//     createWebsiteElement: function (website, containerIndex, gridIndex, websiteIndex, isEditMode) {
//         const websiteElement = document.createElement('div');
//         websiteElement.classList.add('grid-item');
//         websiteElement.setAttribute('draggable', isEditMode);
//         websiteElement.setAttribute('data-grid-index', gridIndex);
//         websiteElement.setAttribute('data-container-index', containerIndex);
//         websiteElement.setAttribute('data-website-index', websiteIndex);

//         const favicon = website.favicon ? `<img src="${website.favicon}" alt="Favicon">` : '';
//         if (isEditMode) {
//             websiteElement.innerHTML = `
//                 ${favicon}
//                 <input type="text" value="${website.name}" data-grid-index="${gridIndex}" data-container-index="${containerIndex}" data-website-index="${websiteIndex}" class="website-name">
//                 <input type="text" value="${website.url}" data-grid-index="${gridIndex}" data-container-index="${containerIndex}" data-website-index="${websiteIndex}" class="website-url">
//                 <input type="text" value="${website.favicon || ''}" data-grid-index="${gridIndex}" data-container-index="${containerIndex}" data-website-index="${websiteIndex}" class="favicon-url" placeholder="Favicon URL">
//                 <button class="delete-button" data-grid-index="${gridIndex}" data-container-index="${containerIndex}" data-website-index="${websiteIndex}">X</button>
//             `;
//         } else {
//             websiteElement.innerHTML = `
//                 ${favicon}
//                 <div>${website.name}</div>
//             `;
//             websiteElement.addEventListener('click', () => {
//                 window.open(website.url, '_blank');
//             });
//         }

//         return websiteElement;
//     },

//     addWebsite: function () {
//         const name = this.websiteNameInput.value.trim();
//         let url = this.websiteUrlInput.value.trim();
//         let favicon = this.faviconUrlInput.value.trim();
//         url = Utils.addHttp(url);
//         if (name && url && Utils.isValidUrl(url)) {
//             if (!favicon) {
//                 favicon = Utils.getFaviconUrl(url);
//             }
//             const newWebsite = { name, url, favicon };
//             // Add the new website to the first grid in the first container for simplicity
//             if (this.gridContainers.length === 0) {
//                 this.addGridContainer();
//             }
//             const firstContainer = this.gridContainers[0];
//             if (firstContainer.grids.length === 0) {
//                 this.addGrid(0);
//             }
//             const firstGrid = firstContainer.grids[0];
//             firstGrid.websites.push(newWebsite);
//             this.websiteNameInput.value = '';
//             this.websiteUrlInput.value = '';
//             this.faviconUrlInput.value = '';
//             Utils.saveToLocalStorage('gridContainers', this.gridContainers);
//             this.renderGridContainersForEdit();
//             Utils.showMessage('Website added successfully!', 'success');
//         } else {
//             Utils.showMessage('Please enter a valid website name and URL.', 'error');
//         }
//     },

//     addGridContainer: function () {
//         const newContainer = { grids: [] };
//         this.gridContainers.push(newContainer);
//         Utils.saveToLocalStorage('gridContainers', this.gridContainers);
//         this.renderGridContainersForEdit();
//         Utils.showMessage('New grid container added successfully!', 'success');
//     },

//     addGrid: function (containerIndex) {
//         if (this.gridContainers[containerIndex].grids.length < 5) {
//             const newGrid = { title: 'New Grid', websites: [] };
//             this.gridContainers[containerIndex].grids.push(newGrid);
//             Utils.saveToLocalStorage('gridContainers', this.gridContainers);
//             this.renderGridContainersForEdit();
//             Utils.showMessage('New grid added successfully!', 'success');
//         } else {
//             Utils.showMessage('Maximum of 5 grids per container reached.', 'error');
//         }
//     },

//     updateGridTitle: function (containerIndex, gridIndex, newTitle) {
//         this.gridContainers[containerIndex].grids[gridIndex].title = newTitle;
//         Utils.saveToLocalStorage('gridContainers', this.gridContainers);
//     },

//     deleteWebsite: function (containerIndex, gridIndex, websiteIndex) {
//         this.gridContainers[containerIndex].grids[gridIndex].websites.splice(websiteIndex, 1);
//         Utils.saveToLocalStorage('gridContainers', this.gridContainers);
//         this.renderGridContainersForEdit();
//         Utils.showMessage('Website deleted successfully!', 'success');
//     },

//     deleteGrid: function (containerIndex, gridIndex) {
//         this.gridContainers[containerIndex].grids.splice(gridIndex, 1);
//         Utils.saveToLocalStorage('gridContainers', this.gridContainers);
//         this.renderGridContainersForEdit();
//         Utils.showMessage('Grid deleted successfully!', 'success');
//     },

//     deleteGridContainer: function (containerIndex) {
//         this.gridContainers.splice(containerIndex, 1);
//         Utils.saveToLocalStorage('gridContainers', this.gridContainers);
//         this.renderGridContainersForEdit();
//         Utils.showMessage('Grid container deleted successfully!', 'success');
//     },

//     onDragStart: function (e) {
//         this.draggedItemIndex = e.target.getAttribute('data-website-index');
//         this.draggedGridIndex = e.target.getAttribute('data-grid-index');
//         this.draggedContainerIndex = e.target.getAttribute('data-container-index');
//         e.dataTransfer.effectAllowed = 'move';
//         e.dataTransfer.setData('text/plain', `${this.draggedContainerIndex},${this.draggedGridIndex},${this.draggedItemIndex}`);
//         e.target.classList.add('draggable');
//     },

//     onDragOver: function (e) {
//         e.preventDefault();
//         e.dataTransfer.dropEffect = 'move';
//     },

//     onDrop: function (e) {
//         e.preventDefault();
//         const [fromContainerIndex, fromGridIndex, fromWebsiteIndex] = e.dataTransfer.getData('text/plain').split(',').map(Number);
//         const targetGridElement = e.target.closest('.grid-column');

//         if (targetGridElement) {
//             const toContainerIndex = Number(targetGridElement.getAttribute('data-container-index'));
//             const toGridIndex = Number(targetGridElement.getAttribute('data-grid-index'));
//             const targetWebsiteElement = e.target.closest('.grid-item');

//             let toWebsiteIndex = null;
//             if (targetWebsiteElement) {
//                 toWebsiteIndex = Number(targetWebsiteElement.getAttribute('data-website-index'));
//             }

//             this.moveWebsite(fromContainerIndex, fromGridIndex, fromWebsiteIndex, toContainerIndex, toGridIndex, toWebsiteIndex);
//         } else {
//             Utils.showMessage('Drop target is invalid.', 'error');
//         }

//         this.editGridContainersWrapper.querySelectorAll('.draggable').forEach(el => el.classList.remove('draggable'));
//     },

//     moveWebsite: function (fromContainerIndex, fromGridIndex, fromWebsiteIndex, toContainerIndex, toGridIndex, toWebsiteIndex) {
//         const draggedItem = this.gridContainers[fromContainerIndex].grids[fromGridIndex].websites.splice(fromWebsiteIndex, 1)[0];

//         if (toWebsiteIndex !== null && toWebsiteIndex !== undefined) {
//             this.gridContainers[toContainerIndex].grids[toGridIndex].websites.splice(toWebsiteIndex, 0, draggedItem);
//         } else {
//             this.gridContainers[toContainerIndex].grids[toGridIndex].websites.push(draggedItem);
//         }

//         Utils.saveToLocalStorage('gridContainers', this.gridContainers);
//         this.renderGridContainersForEdit();
//         Utils.showMessage('Website moved successfully!', 'success');
//     },

//     handleGridContainerClick: function (e) {
//         if (e.target.closest('.addGridButton')) {
//             const containerIndex = e.target.closest('.addGridButton').getAttribute('data-container-id');
//             this.addGrid(containerIndex);
//         } else if (e.target.classList.contains('delete-button')) {
//             const containerIndex = e.target.getAttribute('data-container-index');
//             const gridIndex = e.target.getAttribute('data-grid-index');
//             const websiteIndex = e.target.getAttribute('data-website-index');
//             this.deleteWebsite(containerIndex, gridIndex, websiteIndex);
//         }
//     }
// };

// function updateTime() {
//     const now = new Date();
//     const hours = now.getHours().toString().padStart(2, '0');
//     const minutes = now.getMinutes().toString().padStart(2, '0');
//     const seconds = now.getSeconds().toString().padStart(2, '0');
//     document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
// }

// document.addEventListener('DOMContentLoaded', () => {
//     WebsiteManager.init();

//     const apiKey = '8e023d8710e2083e37b45f85714e1e51'; // Replace with your OpenWeatherMap API key
//     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${apiKey}&units=metric`;

//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             const location = data.name;
//             const temperature = `${Math.round(data.main.temp)}°C`;
//             const description = data.weather[0].description;
//             const iconCode = data.weather[0].icon;
//             const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

//             document.getElementById('location').textContent = location;
//             document.getElementById('temperature').textContent = temperature;
//             document.getElementById('description').textContent = description;
//             document.getElementById('icon').innerHTML = `<img src="${iconUrl}" alt="Weather Icon">`;
//         })
//         .catch(error => console.log('Error fetching weather data:', error));

//     updateTime();
//     setInterval(updateTime, 1000);
// });
