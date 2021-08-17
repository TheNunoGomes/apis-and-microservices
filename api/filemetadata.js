function getFileMetadataHTML(req, res) {
  res.sendFile(process.cwd() + "/views/filemetadata.html");
}

module.exports = { getFileMetadataHTML };
