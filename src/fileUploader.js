/**
 * This method validates that a proper element reference has been supplied
 * @param el
 * @returns HTMLElement reference of the supplied selector path
 */
function validateElement(el) {
    if (!(el instanceof HTMLElement)) {
        return document.querySelector(el) || document.body;
    }

    return el;
}

/**
 * Removes all child nodes from an element recursively
 * @param el
 * @returns Element Supplied
 */
function removeChildNodes(el) {
    while (el.lastChild) {
        el.removeChild(el.lastChild);
    }

    return el;
}

/**
 * File Upload Constructor
 * @param options
 * @constructor
 */
function FileUploader(options) {
    options = options || {};
    options.el = validateElement(options.el);
    options.previewEl = validateElement(options.previewEl);
    options.allowMultiple = !!options.allowMultiple;
    options.extraData = options.extraData || {};
    options.filesParam = options.filesParam || 'files';

    this.options = options;

    this.init();
}

FileUploader.prototype = {
    showPreviews: function () {
        var files = this.files;

        this.options.previewEl = removeChildNodes(this.options.previewEl);

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var imageValidationRegex = /^image\//;

            if (!imageValidationRegex.test(file.type)) {
                continue;
            }

            var previewImage = document.createElement('img');
            previewImage.src = window.URL.createObjectURL(file);
            previewImage.height = 60;
            previewImage.onload = function () {
                window.URL.revokeObjectURL(this.src);
            };

            this.options.previewEl.appendChild(previewImage);
        }
    },
    appendFileInput: function () {
        var self = this;
        var options = this.options;
        var input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';

        if (options.id) {
            input.id = options.id;
        }

        input.multiple = options.allowMultiple;
        input.accept = Array.isArray(options.accept) ? options.accept.join(', ') : options.accept || '*/*';

        input.addEventListener('change', function () {
            self.files = this.files;
            self.showPreviews();
        }, false);

        this.fileInputReference = input;

        options.el.appendChild(input);
    },
    init: function () {
        this.appendFileInput();
    },
    browse: function () {
      this.fileInputReference.click();
    },
    upload: function () {
        var i;
        var data = new FormData();
        var extraParams = Object.keys(this.options.extraData) || [];

        if (!(this.files && this.files.length)) {
            alert('No files selected to upload!');
            return false;
        }

        if (!(this.options.url)) {
            alert('No URL Specified to upload!');
            return false;
        }

        for (i = 0; i < this.files.length; i++) {
            data.append(this.options.filesParam + '[]', this.files[i]);
        }

        for (i = 0; i < extraParams.length; i++) {
            data.append(extraParams[i], this.options.extraData[extraParams[i]]);
        }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.options.url, true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                alert('Files uploaded successfully');
            } else {
                alert('Files could not be uploaded successfully');
            }
        };

        xhr.send(data);
    }
};