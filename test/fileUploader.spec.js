describe('method: validateElement', function () {
    var div;

    beforeEach(function () {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(function () {
        document.body.removeChild(div);
    });

    it('should return the same element when it is a dom element', function () {
        expect(validateElement(div)).toBe(div);
    });

    it('should return the dom reference of a string element reference', function () {
        expect(validateElement('div').tagName).toBe('DIV');
    });

    it('should return body when no el has been specified', function () {
        expect(validateElement()).toBe(document.body);
    });
});

describe('method: removeChildNodes', function () {
    it('should remove all the child nodes from an element', function () {
        var div = document.createElement('div');
        div.id = 'parent';
        div.innerHTML = '<span>Hello World</span>';
        document.body.appendChild(div);
        expect(removeChildNodes(document.querySelector('#parent')).childElementCount).toEqual(0);
    });
});

describe('module: FileUploader', function () {

    function b64toBlob(b64Data, contentType) {
        var sliceSize = 512;
        contentType = contentType || '';

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }

    function getImageFile() {
        var contentType = 'image/png';
        var b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

        return b64toBlob(b64Data, contentType);
    }

    function getJSFile() {
        var contentType = 'text/javascript';
        var b64Data = 'dmFyIHggPSAnSGVsbG8gV29ybGQnOw==';

        return b64toBlob(b64Data, contentType);
    }

    describe('method: constructor', function () {
        afterEach(function () {
            document.body.innerHTML = '';
        });
        it('should initialize the constructor and set the options on this with no options', function () {
            spyOn(FileUploader.prototype, 'init');
            var fileUploader = new FileUploader();
            expect(fileUploader.options).toEqual({
                el: document.body,
                previewEl: document.body,
                allowMultiple: false,
                extraData: {}
            });

            expect(fileUploader.init).toHaveBeenCalled();
        });

        it('should initialize the constructor with the passed options', function () {
            var div = document.createElement('div');
            div.id = 'parent';
            document.body.appendChild(div);

            var fileUploader = new FileUploader({
                allowMultiple: true,
                el: document.querySelector('#parent'),
                previewEl: document.querySelector('#parent'),
                url: '/upload'
            });

            expect(fileUploader.options).toEqual({
                el: document.querySelector('#parent'),
                previewEl: document.querySelector('#parent'),
                allowMultiple: true,
                url: '/upload',
                extraData: {}
            });
        });
    });

    describe('method: init', function () {
        afterEach(function () {
            document.body.innerHTML = '';
        });
        it('should append the file input box on init', function () {
            spyOn(FileUploader.prototype, 'appendFileInput');
            var fileUploader = new FileUploader();
            fileUploader.init();

            expect(fileUploader.appendFileInput).toHaveBeenCalled();
        });
    });

    describe('method: appendFileInput', function () {
        afterEach(function () {
            document.body.innerHTML = '';
        });
        it('should append the file input box', function () {
            spyOn(FileUploader.prototype, 'init').and.callFake(function () {
            });

            var div = document.createElement('div');
            div.id = 'parent';
            document.body.appendChild(div);

            var fileUploader = new FileUploader({
                el: '#parent',
                previewEl: '#parent',
                multiple: false,
                accept: 'image/png',
                id: 'fileSelector'
            });
            fileUploader.appendFileInput();

            expect(fileUploader.options.id).toBe('fileSelector')
            expect(document.querySelector('#parent').childElementCount).toBe(1);
            expect(document.querySelector('#parent').childNodes[0].tagName).toBe('INPUT');
            expect(document.querySelector('#parent').childNodes[0].getAttribute('accept')).toBe('image/png');
        });
    });

    describe('method: showPreviews', function () {
        it('should do something', function () {
            spyOn(FileUploader.prototype, 'init').and.callFake(function () {
            });

            var div = document.createElement('div');
            div.id = 'parent';
            document.body.appendChild(div);

            var fileUploader = new FileUploader({
                el: '#parent',
                previewEl: '#parent',
                multiple: false,
                accept: 'image/png',
                id: 'fileSelector'
            });

            fileUploader.files = [getImageFile()];

            fileUploader.showPreviews();

            expect(document.querySelector('#parent').childElementCount).toBe(1);
            expect(document.querySelector('#parent').childNodes[0].tagName).toBe('IMG');
        });

        it('should do something', function () {
            spyOn(FileUploader.prototype, 'init').and.callFake(function () {
            });

            var div = document.createElement('div');
            div.id = 'parent';
            document.body.appendChild(div);

            var fileUploader = new FileUploader({
                el: '#parent',
                previewEl: '#parent',
                multiple: false,
                accept: 'image/png',
                id: 'fileSelector'
            });

            fileUploader.files = [getJSFile()];

            fileUploader.showPreviews();

            expect(document.querySelector('#parent').childElementCount).toBe(0);
        });
    });

    describe('method: upload', function () {
        beforeEach(function () {
            jasmine.Ajax.install();

            // Help from https://groups.google.com/forum/#!topic/jasmine-js/xsKZDzorh6E
            jasmine.Ajax.addCustomParamParser({
                test: function (xhr) {
                    return xhr.params instanceof FormData;
                },
                parse: function (formData) {
                    return formData;
                }
            });
        });

        afterEach(function () {
            jasmine.Ajax.uninstall();
        });

        it('should send extra data with upload', function () {
            spyOn(FileUploader.prototype, 'init').and.callFake(function () {
            });

            var div = document.createElement('div');
            div.id = 'parent';
            document.body.appendChild(div);

            var fileUploader = new FileUploader({
                el: '#parent',
                url: 'upload',
                previewEl: '#parent',
                multiple: false,
                accept: 'image/png',
                id: 'fileSelector',
                extraData: {
                    user_id: 100
                }
            });

            fileUploader.files = [getImageFile()];

            fileUploader.upload();
            expect(jasmine.Ajax.requests.mostRecent().data().get('user_id')).toEqual('100');
        });

        it('should alert the success message', function () {
            spyOn(FileUploader.prototype, 'init').and.callFake(function () {
            });
            spyOn(window, 'alert').and.callFake(function (message) {
            });

            var div = document.createElement('div');
            div.id = 'parent';
            document.body.appendChild(div);

            var fileUploader = new FileUploader({
                el: '#parent',
                previewEl: '#parent',
                multiple: false,
                accept: 'image/png',
                id: 'fileSelector',
                url: 'upload',
                extraData: {
                    user_id: 100
                }
            });

            fileUploader.files = [getImageFile()];

            fileUploader.upload();

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
            expect(window.alert).toHaveBeenCalledWith('Files uploaded successfully');
        });

        it('should alert the failure message', function () {
            spyOn(FileUploader.prototype, 'init').and.callFake(function () {
            });
            spyOn(window, 'alert').and.callFake(function (message) {
            });

            var div = document.createElement('div');
            div.id = 'parent';
            document.body.appendChild(div);

            var fileUploader = new FileUploader({
                el: '#parent',
                previewEl: '#parent',
                multiple: false,
                accept: 'image/png',
                id: 'fileSelector',
                url: 'upload',
                extraData: {
                    user_id: 100
                }
            });

            fileUploader.files = [getImageFile()];

            fileUploader.upload();

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 400
            });
            expect(window.alert).toHaveBeenCalledWith('Files could not be uploaded successfully');
        });

        it('should upload the files', function () {
            spyOn(FileUploader.prototype, 'init').and.callFake(function () {});
            spyOn(window, 'alert').and.callFake(function (message) {});

            var div = document.createElement('div');
            div.id = 'parent';
            document.body.appendChild(div);

            var fileUploader = new FileUploader({
                el: '#parent',
                previewEl: '#parent',
                multiple: false,
                accept: 'image/png',
                id: 'fileSelector',
                url: 'upload',
                extraData: {
                    user_id: 100
                }
            });

            fileUploader.files = [getImageFile()];

            fileUploader.upload();

            var filesList = jasmine.Ajax.requests.mostRecent().data().getAll('files[]');
            expect(filesList[0].type).toEqual('image/png');
        });

        it('should alert when no url has been specified', function () {
            spyOn(FileUploader.prototype, 'init').and.callFake(function () {});
            spyOn(window, 'alert').and.callFake(function (message) {});

            var div = document.createElement('div');
            div.id = 'parent';
            document.body.appendChild(div);

            var fileUploader = new FileUploader({
                el: '#parent',
                previewEl: '#parent',
                multiple: false,
                accept: 'image/png',
                id: 'fileSelector',
                extraData: {
                    user_id: 100
                }
            });

            fileUploader.files = [getImageFile()];

            fileUploader.upload();

            expect(window.alert).toHaveBeenCalledWith('No URL Specified to upload!');
        });

        it('should alert when no url has been specified', function () {
            spyOn(FileUploader.prototype, 'init').and.callFake(function () {});
            spyOn(window, 'alert').and.callFake(function (message) {});

            var div = document.createElement('div');
            div.id = 'parent';
            document.body.appendChild(div);

            var fileUploader = new FileUploader({
                el: '#parent',
                previewEl: '#parent',
                multiple: false,
                accept: 'image/png',
                id: 'fileSelector',
                extraData: {
                    user_id: 100
                }
            });

            fileUploader.files = [];

            fileUploader.upload();

            expect(window.alert).toHaveBeenCalledWith('No files selected to upload!');
        });
    });
});