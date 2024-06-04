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
    grids: Utils.loadFromLocalStorage('grids'),

    init: function () {
        this.cacheDom();
        this.bindEvents();
        this.render();
    },

    cacheDom: function () {
        this.editModeButton = document.getElementById('editModeButton');
        this.editMode = document.querySelector('.edit-mode');
        this.gridsContainer = document.getElementById('gridsContainer');
        this.addWebsiteButton = document.getElementById('addWebsiteButton');
        this.addGridButton = document.getElementById('addGridButton');
        this.websiteNameInput = document.getElementById('websiteName');
        this.websiteUrlInput = document.getElementById('websiteUrl');
        this.faviconUrlInput = document.getElementById('faviconUrl');
    },

    bindEvents: function () {
        this.editModeButton.addEventListener('click', this.toggleMode.bind(this));
        this.addWebsiteButton.addEventListener('click', this.addWebsite.bind(this));
        this.addGridButton.addEventListener('click', this.addGrid.bind(this));
        this.gridsContainer.addEventListener('click', this.handleGridClick.bind(this));
        this.gridsContainer.addEventListener('dragstart', this.onDragStart.bind(this));
        this.gridsContainer.addEventListener('dragover', this.onDragOver.bind(this));
        this.gridsContainer.addEventListener('drop', this.onDrop.bind(this));
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
        this.renderGridsForEdit();
    },

    toggleRenderMode: function () {
        this.editMode.style.display = 'none';
        this.renderGrids();
    },

    renderGrids: function () {
        this.gridsContainer.innerHTML = '';
        this.grids.forEach((grid, gridIndex) => {
            const gridElement = this.createGridElement(grid, gridIndex, false);
            this.gridsContainer.appendChild(gridElement);
        });
    },

    renderGridsForEdit: function () {
        this.gridsContainer.innerHTML = '';
        this.grids.forEach((grid, gridIndex) => {
            const gridElement = this.createGridElement(grid, gridIndex, true);
            this.gridsContainer.appendChild(gridElement);
        });
    },

    createGridElement: function (grid, gridIndex, isEditMode) {
        const gridElement = document.createElement('div');
        gridElement.classList.add('grid-column');
        gridElement.setAttribute('data-grid-index', gridIndex);

        const titleElement = document.createElement('div');
        titleElement.classList.add('grid-title');
        titleElement.textContent = grid.title;
        if (isEditMode) {
            titleElement.setAttribute('contenteditable', 'true');
            titleElement.addEventListener('blur', () => {
                this.updateGridTitle(gridIndex, titleElement.textContent);
            });
        }

        gridElement.appendChild(titleElement);

        const websitesContainer = document.createElement('div');
        websitesContainer.classList.add('grid');
        websitesContainer.setAttribute('data-grid-index', gridIndex);

        grid.websites.forEach((website, websiteIndex) => {
            const websiteElement = this.createWebsiteElement(website, gridIndex, websiteIndex, isEditMode);
            websitesContainer.appendChild(websiteElement);
        });

        gridElement.appendChild(websitesContainer);

        return gridElement;
    },

    createWebsiteElement: function (website, gridIndex, websiteIndex, isEditMode) {
        const websiteElement = document.createElement('div');
        websiteElement.classList.add('grid-item');
        websiteElement.setAttribute('draggable', 'true');
        websiteElement.setAttribute('data-grid-index', gridIndex);
        websiteElement.setAttribute('data-website-index', websiteIndex);

        const favicon = website.favicon ? `<img src="${website.favicon}" alt="Favicon">` : '';
        if (isEditMode) {
            websiteElement.innerHTML = `
                ${favicon}
                <input type="text" value="${website.name}" data-grid-index="${gridIndex}" data-website-index="${websiteIndex}" class="website-name">
                <input type="text" value="${website.url}" data-grid-index="${gridIndex}" data-website-index="${websiteIndex}" class="website-url">
                <input type="text" value="${website.favicon || ''}" data-grid-index="${gridIndex}" data-website-index="${websiteIndex}" class="favicon-url" placeholder="Favicon URL">
                <button class="delete-button" data-grid-index="${gridIndex}" data-website-index="${websiteIndex}">X</button>
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
            const activeGrid = this.grids[0];
            activeGrid.websites.push(newWebsite);
            this.websiteNameInput.value = '';
            this.websiteUrlInput.value = '';
            this.faviconUrlInput.value = '';
            Utils.saveToLocalStorage('grids', this.grids);
            this.renderGridsForEdit();
            Utils.showMessage('Website added successfully!', 'success');
        } else {
            Utils.showMessage('Please enter a valid website name and URL.', 'error');
        }
    },

    addGrid: function () {
        const newGrid = { title: 'New Grid', websites: [] };
        this.grids.push(newGrid);
        Utils.saveToLocalStorage('grids', this.grids);
        this.renderGridsForEdit();
        Utils.showMessage('New grid added successfully!', 'success');
    },

    updateGridTitle: function (gridIndex, newTitle) {
        this.grids[gridIndex].title = newTitle;
        Utils.saveToLocalStorage('grids', this.grids);
    },

    deleteWebsite: function (gridIndex, websiteIndex) {
        this.grids[gridIndex].websites.splice(websiteIndex, 1);
        Utils.saveToLocalStorage('grids', this.grids);
        this.renderGridsForEdit();
        Utils.showMessage('Website deleted successfully!', 'success');
    },

    onDragStart: function (e) {
        this.draggedItemIndex = e.target.getAttribute('data-website-index');
        this.draggedGridIndex = e.target.getAttribute('data-grid-index');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `${this.draggedGridIndex},${this.draggedItemIndex}`);
        e.target.classList.add('draggable');
    },

    onDragOver: function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    },

    onDrop: function (e) {
        e.preventDefault();
        const [fromGridIndex, fromWebsiteIndex] = e.dataTransfer.getData('text/plain').split(',').map(Number);
        const targetGridElement = e.target.closest('.grid-column');

        if (targetGridElement) {
            const toGridIndex = Number(targetGridElement.getAttribute('data-grid-index'));
            const targetWebsiteElement = e.target.closest('.grid-item');

            let toWebsiteIndex = null;
            if (targetWebsiteElement) {
                toWebsiteIndex = Number(targetWebsiteElement.getAttribute('data-website-index'));
            }

            this.moveWebsite(fromGridIndex, fromWebsiteIndex, toGridIndex, toWebsiteIndex);
        } else {
            Utils.showMessage('Drop target is invalid.', 'error');
        }

        this.gridsContainer.querySelectorAll('.draggable').forEach(el => el.classList.remove('draggable'));
    },

    moveWebsite: function (fromGridIndex, fromWebsiteIndex, toGridIndex, toWebsiteIndex) {
        const draggedItem = this.grids[fromGridIndex].websites.splice(fromWebsiteIndex, 1)[0];

        if (toWebsiteIndex !== null && toWebsiteIndex !== undefined) {
            this.grids[toGridIndex].websites.splice(toWebsiteIndex, 0, draggedItem);
        } else {
            this.grids[toGridIndex].websites.push(draggedItem);
        }

        Utils.saveToLocalStorage('grids', this.grids);
        this.renderGridsForEdit();
        Utils.showMessage('Website moved successfully!', 'success');
    },

    handleGridClick: function (e) {
        if (e.target.classList.contains('delete-button')) {
            const gridIndex = e.target.getAttribute('data-grid-index');
            const websiteIndex = e.target.getAttribute('data-website-index');
            this.deleteWebsite(gridIndex, websiteIndex);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    WebsiteManager.init();
});
