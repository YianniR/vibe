const Utils = {
    isValidUrl: (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    },
    addHttp: (url) => {
        if (!/^https?:\/\//i.test(url)) {
            return 'http://' + url;
        }
        return url;
    },
    saveToLocalStorage: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    },
    loadFromLocalStorage: (key) => {
        return JSON.parse(localStorage.getItem(key)) || [];
    },
    getFaviconUrl: (url) => {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}`;
    },
    showMessage: (message, type) => {
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
};

const WebsiteManager = {
    gridContainers: Utils.loadFromLocalStorage('gridContainers'),

    init: function () {
        this.cacheDom();
        this.bindEvents();
        this.render();
    },

    cacheDom: function () {
        this.editModeButton = document.getElementById('editModeButton');
        this.editMode = document.querySelector('.edit-mode');
        this.gridContainersWrapper = document.getElementById('gridContainersWrapper');
        this.addWebsiteButton = document.getElementById('addWebsiteButton');
        this.addGridContainerButton = document.getElementById('addGridContainerButton');
        this.websiteNameInput = document.getElementById('websiteName');
        this.websiteUrlInput = document.getElementById('websiteUrl');
        this.faviconUrlInput = document.getElementById('faviconUrl');
    },

    bindEvents: function () {
        this.editModeButton.addEventListener('click', this.toggleMode.bind(this));
        this.addWebsiteButton.addEventListener('click', this.addWebsite.bind(this));
        this.addGridContainerButton.addEventListener('click', this.addGridContainer.bind(this));
        this.gridContainersWrapper.addEventListener('click', this.handleGridContainerClick.bind(this));
        this.gridContainersWrapper.addEventListener('dragstart', this.onDragStart.bind(this));
        this.gridContainersWrapper.addEventListener('dragover', this.onDragOver.bind(this));
        this.gridContainersWrapper.addEventListener('drop', this.onDrop.bind(this));
    },

    render: function () {
        if (this.editModeButton.classList.contains('back-button')) {
            this.toggleEditMode();
        } else {
            this.toggleRenderMode();
        }
    },

    toggleMode: function () {
        if (this.editModeButton.classList.contains('back-button')) {
            this.editModeButton.classList.remove('back-button');
            this.editModeButton.innerHTML = '<i class="fas fa-cog"></i>';
            this.toggleRenderMode();
        } else {
            this.editModeButton.classList.add('back-button');
            this.editModeButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
            this.toggleEditMode();
        }
    },

    toggleEditMode: function () {
        this.editMode.style.display = 'block';
        this.addGridContainerButton.style.display = 'block';
        document.querySelectorAll('.addGridButton').forEach(button => {
            button.style.display = 'flex';
        });
        this.makeDraggable(true);
        this.renderGridContainersForEdit();
    },

    toggleRenderMode: function () {
        this.editMode.style.display = 'none';
        this.addGridContainerButton.style.display = 'none';
        document.querySelectorAll('.addGridButton').forEach(button => {
            button.style.display = 'none';
        });
        this.makeDraggable(false);
        this.renderGridContainers();
    },

    makeDraggable: function (isEditable) {
        const draggableItems = document.querySelectorAll('.grid-item');
        draggableItems.forEach(item => {
            item.setAttribute('draggable', isEditable);
        });
    },

    renderGridContainers: function () {
        this.gridContainersWrapper.innerHTML = '';
        this.gridContainers.forEach((container, containerIndex) => {
            const containerElement = this.createGridContainerElement(container, containerIndex, false);
            this.gridContainersWrapper.appendChild(containerElement);
        });
    },

    renderGridContainersForEdit: function () {
        this.gridContainersWrapper.innerHTML = '';
        this.gridContainers.forEach((container, containerIndex) => {
            const containerElement = this.createGridContainerElement(container, containerIndex, true);
            this.gridContainersWrapper.appendChild(containerElement);
        });
    },

    createGridContainerElement: function (container, containerIndex, isEditMode) {
        const containerElement = document.createElement('div');
        containerElement.classList.add('grid-container');
        containerElement.setAttribute('id', `gridContainer${containerIndex}`);

        const gridsWrapper = document.createElement('div');
        gridsWrapper.classList.add('grids-wrapper');
        gridsWrapper.setAttribute('id', `gridsWrapper${containerIndex}`);

        container.grids.forEach((grid, gridIndex) => {
            const gridElement = this.createGridElement(grid, containerIndex, gridIndex, isEditMode);
            gridsWrapper.appendChild(gridElement);
        });

        if (isEditMode && container.grids.length < 5) {
            const addGridButton = document.createElement('button');
            addGridButton.classList.add('addGridButton', 'add-grid-button');
            addGridButton.setAttribute('data-container-id', containerIndex);
            addGridButton.innerHTML = '<i class="fas fa-plus"></i>';
            gridsWrapper.appendChild(addGridButton); // Ensure the button is added at the end
        }

        containerElement.appendChild(gridsWrapper);

        return containerElement;
    },

    createGridElement: function (grid, containerIndex, gridIndex, isEditMode) {
        const gridElement = document.createElement('div');
        gridElement.classList.add('grid-column');
        gridElement.setAttribute('data-grid-index', gridIndex);
        gridElement.setAttribute('data-container-index', containerIndex);

        const titleElement = document.createElement('div');
        titleElement.classList.add('grid-title');
        titleElement.textContent = grid.title;
        if (isEditMode) {
            titleElement.setAttribute('contenteditable', 'true');
            titleElement.addEventListener('blur', () => {
                this.updateGridTitle(containerIndex, gridIndex, titleElement.textContent);
            });
        }

        gridElement.appendChild(titleElement);

        const websitesContainer = document.createElement('div');
        websitesContainer.classList.add('grid');
        websitesContainer.setAttribute('data-grid-index', gridIndex);
        websitesContainer.setAttribute('data-container-index', containerIndex);

        grid.websites.forEach((website, websiteIndex) => {
            const websiteElement = this.createWebsiteElement(website, containerIndex, gridIndex, websiteIndex, isEditMode);
            websitesContainer.appendChild(websiteElement);
        });

        gridElement.appendChild(websitesContainer);

        return gridElement;
    },

    createWebsiteElement: function (website, containerIndex, gridIndex, websiteIndex, isEditMode) {
        const websiteElement = document.createElement('div');
        websiteElement.classList.add('grid-item');
        websiteElement.setAttribute('draggable', isEditMode);
        websiteElement.setAttribute('data-grid-index', gridIndex);
        websiteElement.setAttribute('data-container-index', containerIndex);
        websiteElement.setAttribute('data-website-index', websiteIndex);

        const favicon = website.favicon ? `<img src="${website.favicon}" alt="Favicon">` : '';
        if (isEditMode) {
            websiteElement.innerHTML = `
                ${favicon}
                <input type="text" value="${website.name}" data-grid-index="${gridIndex}" data-container-index="${containerIndex}" data-website-index="${websiteIndex}" class="website-name">
                <input type="text" value="${website.url}" data-grid-index="${gridIndex}" data-container-index="${containerIndex}" data-website-index="${websiteIndex}" class="website-url">
                <input type="text" value="${website.favicon || ''}" data-grid-index="${gridIndex}" data-container-index="${containerIndex}" data-website-index="${websiteIndex}" class="favicon-url" placeholder="Favicon URL">
                <button class="delete-button" data-grid-index="${gridIndex}" data-container-index="${containerIndex}" data-website-index="${websiteIndex}">X</button>
            `;
        } else {
            websiteElement.innerHTML = `
                ${favicon}
                <div>${website.name}</div>
            `;
            websiteElement.addEventListener('click', () => {
                window.open(website.url, '_blank');
            });
        }

        return websiteElement;
    },

    addWebsite: function () {
        const name = this.websiteNameInput.value.trim();
        let url = this.websiteUrlInput.value.trim();
        let favicon = this.faviconUrlInput.value.trim();
        url = Utils.addHttp(url);
        if (name && url && Utils.isValidUrl(url)) {
            if (!favicon) {
                favicon = Utils.getFaviconUrl(url);
            }
            const newWebsite = { name, url, favicon };
            const activeContainer = this.gridContainers[0];
            const activeGrid = activeContainer.grids[0];
            activeGrid.websites.push(newWebsite);
            this.websiteNameInput.value = '';
            this.websiteUrlInput.value = '';
            this.faviconUrlInput.value = '';
            Utils.saveToLocalStorage('gridContainers', this.gridContainers);
            this.renderGridContainersForEdit();
            Utils.showMessage('Website added successfully!', 'success');
        } else {
            Utils.showMessage('Please enter a valid website name and URL.', 'error');
        }
    },

    addGridContainer: function () {
        const newContainer = { grids: [] };
        this.gridContainers.push(newContainer);
        Utils.saveToLocalStorage('gridContainers', this.gridContainers);
        this.renderGridContainersForEdit();
        Utils.showMessage('New grid container added successfully!', 'success');
    },

    addGrid: function (containerIndex) {
        if (this.gridContainers[containerIndex].grids.length < 5) {
            const newGrid = { title: 'New Grid', websites: [] };
            this.gridContainers[containerIndex].grids.push(newGrid);
            Utils.saveToLocalStorage('gridContainers', this.gridContainers);
            this.renderGridContainersForEdit();
            Utils.showMessage('New grid added successfully!', 'success');
        } else {
            Utils.showMessage('Maximum of 5 grids per container reached.', 'error');
        }
    },

    updateGridTitle: function (containerIndex, gridIndex, newTitle) {
        this.gridContainers[containerIndex].grids[gridIndex].title = newTitle;
        Utils.saveToLocalStorage('gridContainers', this.gridContainers);
    },

    deleteWebsite: function (containerIndex, gridIndex, websiteIndex) {
        this.gridContainers[containerIndex].grids[gridIndex].websites.splice(websiteIndex, 1);
        Utils.saveToLocalStorage('gridContainers', this.gridContainers);
        this.renderGridContainersForEdit();
        Utils.showMessage('Website deleted successfully!', 'success');
    },

    onDragStart: function (e) {
        this.draggedItemIndex = e.target.getAttribute('data-website-index');
        this.draggedGridIndex = e.target.getAttribute('data-grid-index');
        this.draggedContainerIndex = e.target.getAttribute('data-container-index');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `${this.draggedContainerIndex},${this.draggedGridIndex},${this.draggedItemIndex}`);
        e.target.classList.add('draggable');
    },

    onDragOver: function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    },

    onDrop: function (e) {
        e.preventDefault();
        const [fromContainerIndex, fromGridIndex, fromWebsiteIndex] = e.dataTransfer.getData('text/plain').split(',').map(Number);
        const targetGridElement = e.target.closest('.grid-column');

        if (targetGridElement) {
            const toContainerIndex = Number(targetGridElement.getAttribute('data-container-index'));
            const toGridIndex = Number(targetGridElement.getAttribute('data-grid-index'));
            const targetWebsiteElement = e.target.closest('.grid-item');

            let toWebsiteIndex = null;
            if (targetWebsiteElement) {
                toWebsiteIndex = Number(targetWebsiteElement.getAttribute('data-website-index'));
            }

            this.moveWebsite(fromContainerIndex, fromGridIndex, fromWebsiteIndex, toContainerIndex, toGridIndex, toWebsiteIndex);
        } else {
            Utils.showMessage('Drop target is invalid.', 'error');
        }

        this.gridContainersWrapper.querySelectorAll('.draggable').forEach(el => el.classList.remove('draggable'));
    },

    moveWebsite: function (fromContainerIndex, fromGridIndex, fromWebsiteIndex, toContainerIndex, toGridIndex, toWebsiteIndex) {
        const draggedItem = this.gridContainers[fromContainerIndex].grids[fromGridIndex].websites.splice(fromWebsiteIndex, 1)[0];

        if (toWebsiteIndex !== null && toWebsiteIndex !== undefined) {
            this.gridContainers[toContainerIndex].grids[toGridIndex].websites.splice(toWebsiteIndex, 0, draggedItem);
        } else {
            this.gridContainers[toContainerIndex].grids[toGridIndex].websites.push(draggedItem);
        }

        Utils.saveToLocalStorage('gridContainers', this.gridContainers);
        this.renderGridContainersForEdit();
        Utils.showMessage('Website moved successfully!', 'success');
    },

    handleGridContainerClick: function (e) {
        if (e.target.closest('.addGridButton')) {
            const containerIndex = e.target.closest('.addGridButton').getAttribute('data-container-id');
            this.addGrid(containerIndex);
        } else if (e.target.classList.contains('delete-button')) {
            const containerIndex = e.target.getAttribute('data-container-index');
            const gridIndex = e.target.getAttribute('data-grid-index');
            const websiteIndex = e.target.getAttribute('data-website-index');
            this.deleteWebsite(containerIndex, gridIndex, websiteIndex);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    WebsiteManager.init();
});
