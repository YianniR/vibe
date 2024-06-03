// Utility functions
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

// Website Manager module
const WebsiteManager = {
    websites: Utils.loadFromLocalStorage('websites'),

    init: function () {
        this.cacheDom();
        this.bindEvents();
        this.render();
    },

    cacheDom: function () {
        this.editRenderSwitch = document.getElementById('editRenderSwitch');
        this.switchLabel = document.getElementById('switchLabel');
        this.editMode = document.querySelector('.edit-mode');
        this.websiteGrid = document.getElementById('websiteGrid');
        this.addWebsiteButton = document.getElementById('addWebsiteButton');
        this.websiteNameInput = document.getElementById('websiteName');
        this.websiteUrlInput = document.getElementById('websiteUrl');
        this.faviconUrlInput = document.getElementById('faviconUrl');
    },

    bindEvents: function () {
        this.editRenderSwitch.addEventListener('change', this.toggleMode.bind(this));
        this.addWebsiteButton.addEventListener('click', this.addWebsite.bind(this));
        this.websiteGrid.addEventListener('click', this.handleGridClick.bind(this));
        this.websiteGrid.addEventListener('dragstart', this.onDragStart.bind(this));
        this.websiteGrid.addEventListener('dragover', this.onDragOver.bind(this));
        this.websiteGrid.addEventListener('drop', this.onDrop.bind(this));
    },

    render: function () {
        this.editMode.style.display === 'block' ? this.renderWebsitesForEdit() : this.renderWebsites();
    },

    toggleMode: function () {
        if (this.editRenderSwitch.checked) {
            this.switchLabel.textContent = 'Edit Mode';
            this.toggleEditMode();
        } else {
            this.switchLabel.textContent = 'Render Mode';
            this.toggleRenderMode();
        }
    },

    toggleEditMode: function () {
        this.editMode.style.display = 'block';
        this.renderWebsitesForEdit();
    },

    toggleRenderMode: function () {
        this.editMode.style.display = 'none';
        this.renderWebsites();
    },

    renderWebsites: function () {
        this.websiteGrid.innerHTML = '';
        this.websites.forEach((website, index) => {
            const websiteElement = this.createWebsiteElement(website, index, false);
            this.websiteGrid.appendChild(websiteElement);
        });
    },

    renderWebsitesForEdit: function () {
        this.websiteGrid.innerHTML = '';
        this.websites.forEach((website, index) => {
            const websiteElement = this.createWebsiteElement(website, index, true);
            this.websiteGrid.appendChild(websiteElement);
        });
    },

    createWebsiteElement: function (website, index, isEditMode) {
        const websiteElement = document.createElement('div');
        websiteElement.classList.add('grid-item');
        websiteElement.setAttribute('draggable', 'true');
        websiteElement.setAttribute('data-index', index);
        const favicon = website.favicon ? `<img src="${website.favicon}" alt="Favicon">` : '';
        if (isEditMode) {
            websiteElement.innerHTML = `
                ${favicon}
                <input type="text" value="${website.name}" data-index="${index}" class="website-name">
                <input type="text" value="${website.url}" data-index="${index}" class="website-url">
                <input type="text" value="${website.favicon || ''}" data-index="${index}"
                <input type="text" value="${website.favicon || ''}" data-index="${index}" class="favicon-url" placeholder="Favicon URL">
                <button class="delete-button" data-index="${index}">X</button>
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
            this.websites.push(newWebsite);
            this.websiteNameInput.value = '';
            this.websiteUrlInput.value = '';
            this.faviconUrlInput.value = '';
            Utils.saveToLocalStorage('websites', this.websites);
            this.renderWebsitesForEdit();
            Utils.showMessage('Website added successfully!', 'success');
        } else {
            Utils.showMessage('Please enter a valid website name and URL.', 'error');
        }
    },

    deleteWebsite: function (index) {
        this.websites.splice(index, 1);
        Utils.saveToLocalStorage('websites', this.websites);
        this.renderWebsitesForEdit();
        Utils.showMessage('Website deleted successfully!', 'success');
    },

    updateWebsites: function () {
        const nameInputs = document.querySelectorAll('.website-name');
        const urlInputs = document.querySelectorAll('.website-url');
        const faviconInputs = document.querySelectorAll('.favicon-url');
        this.websites = [];
        nameInputs.forEach((input, index) => {
            const name = input.value;
            const url = urlInputs[index].value;
            const favicon = faviconInputs[index].value;
            if (name && url) {
                this.websites.push({ name, url, favicon: Utils.isValidUrl(favicon) ? favicon : null });
            }
        });
        Utils.saveToLocalStorage('websites', this.websites);
    },

    onDragStart: function (e) {
        this.draggedItemIndex = e.target.getAttribute('data-index');
        e.target.classList.add('draggable');
    },

    onDragOver: function (e) {
        e.preventDefault();
    },

    onDrop: function (e) {
        e.preventDefault();
        const targetElement = e.target.closest('.grid-item');
        if (targetElement) {
            const targetIndex = targetElement.getAttribute('data-index');
            this.reorderWebsites(this.draggedItemIndex, targetIndex);
        }
        const draggableElements = this.websiteGrid.querySelectorAll('.draggable');
        draggableElements.forEach(el => el.classList.remove('draggable'));
        Utils.showMessage('Website order updated successfully!', 'success');
    },

    reorderWebsites: function (fromIndex, toIndex) {
        const draggedItem = this.websites[fromIndex];
        this.websites.splice(fromIndex, 1);
        this.websites.splice(toIndex, 0, draggedItem);
        Utils.saveToLocalStorage('websites', this.websites);
        this.renderWebsitesForEdit();
    },

    handleGridClick: function (e) {
        if (e.target.classList.contains('delete-button')) {
            const index = e.target.getAttribute('data-index');
            this.deleteWebsite(index);
        }
    }
};

// Initialize the Website Manager
document.addEventListener('DOMContentLoaded', () => {
    WebsiteManager.init();
});
