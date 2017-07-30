const ImagePathBuilder = class ImagePathBuilder {
    constructor(directory, fileId, fileExtension) {
        this.directory = directory;
        this.id = fileId;
        this.fileExtension = fileExtension;
    }
    fileName() {
        return `${this.id}.${this.fileExtension}`;
    }
    filePath() {
        return `./${this.directory}/${this.id}.${this.fileExtension}`;
    }
    thumbnailPath() {
        return `./${this.directory}/${this.id}.thumbnail.${this.fileExtension}`;
    }
    fileUri(req) {
        return `${req.headers.host}/${this.id}.${this.fileExtension}`;
    }
    thumbnailUri(req) {
        return `${req.headers.host}/${this.id}.thumbnail.${this.fileExtension}`;
    }  
}

module.exports = ImagePathBuilder;